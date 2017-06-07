import {
  isPrimitive,
  isFunctionalComponent,
  isFunction,
  isCustomProp,
  isEventProp,
} from './is'
const removeAttribute = ($target, name, value) => {
  if (isEventProp(name)) {
    return;
  } else if (value === 'className') {
    $target.removeAttribute('class')
  } else {
    $target.removeAttribute(name)
    if (typeof value === 'boolean') {
      $target[name] = false
    }
  }
}

const patchProp = ($target, propName, newValue, oldValue) => {
  if (isEventProp(propName)) {
    return
  }
  if (!newValue) {
    removeAttribute($target, propName, oldValue)
  } else if (!oldValue || newValue !== oldValue) {
    $target.setAttribute(propName, newValue)
    if (typeof newValue === 'boolean') {
      $target[propName] = newValue
    }
  } else if (typeof newValue === 'boolean') {
    $target[propName] = newValue
  }
}

const patchProps = ($target, newProps, oldProps = {}) => {
  const allProps = Object.assign({}, newProps, oldProps)
  Object.keys(allProps).forEach(name => {
    patchProp($target, name, newProps[name], oldProps[name])
  })
}

const shouldUseChangeEvent = ($target) => {
  const nodeName = $target.nodeName && $target.nodeName.toLowerCase()
  return nodeName === 'select' || nodeName === 'input' && $target.type === 'file'
}

const addEventListener = ($target, event, cb) => {
  if (event === 'change') {
    if (shouldUseChangeEvent($target)) {
      $target.addEventListener(event, cb)
    } else {
      $target.addEventListener('input', cb)
    }
  } else {
    $target.addEventListener(event, cb)
  }
}

const addEventListeners = ($target, props) => {
  Object.keys(props).forEach(key => {
    if (isEventProp(key)) {
      addEventListener($target, key.slice(2).toLowerCase(), props[key])
    }
  })
}

export const createElement = (vnode) => {
  if (isPrimitive(vnode)) {
    return document.createTextNode(vnode)
  }
  const $el = document.createElement(vnode.type)
  if (vnode._component) {
    vnode._component.$node = $el
  }
  patchProps($el, vnode.props)
  addEventListeners($el, vnode.props)
  vnode.children
    .map(createElement)
    .forEach($el.appendChild.bind($el))
  return $el
}

const changed = (node1, node2) => {
  return (
    typeof node1 !== typeof node2 ||
    isPrimitive(node1) && node1 !== node2 ||
    node1.type !== node2.type
  )
}

const resolveComponents = (newNode, oldNode) => {
  if (isPrimitive(newNode)) {
    return newNode
  }
  while (isFunctionalComponent(newNode.type)) {
    const props = Object.assign({}, newNode.props, {children: newNode.children})
    newNode = newNode.type(props)
  }

  let component = oldNode && oldNode._component

  if (isFunction(newNode.type)) {
    const props = Object.assign({}, newNode.props, {children: newNode.children})
    component = component || new newNode.type(props)
    if (component.shouldComponentUpdate()) {
      newNode = component.render()
    } else {
      newNode = oldNode.vnode
    }
    component.vnode = newNode
    newNode._component = component
  }

  for (let i = 0; i < newNode.children.length; i++) {
    newNode.children[i] = resolveComponents(
      newNode.children[i],
      oldNode && oldNode.children[i]
    )
  }
  return newNode
}

export const patch = ($parent, newNode, oldNode, index = 0) => {
  newNode = resolveComponents(newNode, oldNode)

  if (typeof oldNode === 'undefined') {
    $parent.appendChild(createElement(newNode))
  } else if (typeof newNode === 'undefined') {
    $parent.removeChild($parent.childNodes[index])
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index])
  } else if (newNode.type) { // not primitive vnode
    // Update props if nothing else has changed
    patchProps(
      $parent.childNodes[index],
      newNode.props,
      oldNode.props
    )

    // Patch children
    const newLen = newNode.children.length
    const oldLen = oldNode.children.length
    for (let i = 0; i < Math.max(newLen, oldLen); i++) {
      patch(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      )
    }
  }

  return newNode
}

export const mount = (vtree, $parent) => {
  $parent.innerHTML = ''
  return patch($parent, vtree)
}
