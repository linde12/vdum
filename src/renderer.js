import makeRenderer from './vdom/renderer'
import {createElement, h} from './vdom'

export const render = (vdom, $root) => {
  const r = makeRenderer($root)
  r.render(vdom)
}

const componentHypertext = (type, props, ...children) => {
  if (typeof type === 'function' && type.prototype.render) {
    const component = new type(props)
    const vnode = component.render()
    component.vnode = vnode
    debugger;
    return vnode;
  } else if (typeof type === 'function') {
    return type(props)
  } else {
    return h(type, props, ...children)
  }
}

export {componentHypertext as h}
