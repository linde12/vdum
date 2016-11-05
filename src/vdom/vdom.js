export const h = function (type, props, ...children) {
  return {type, props: props || {}, children}
}

const isEventProp = (name) => /^on/.test(name)
const isCustomProp = (name) => isEventProp(name)
const isPrimitive = (node) => {
  return typeof node === 'string' ||
    typeof node === 'number' ||
    typeof node === 'boolean'
}

const removeAttribute = ($target, name, value) => {
  if (isCustomProp(name)) {
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
  if (isCustomProp(propName)) {
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

const addEventListener = ($target, event, cb) => {
  $target.addEventListener(event, cb)
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
  debugger;
  vnode.$node = $el // this should not be handeled by vdom
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

export const patch = ($parent, newNode, oldNode, index = 0) => {
  if (!oldNode) {
    $parent.appendChild(createElement(newNode))
  } else if (!newNode) {
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
