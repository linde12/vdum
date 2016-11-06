import {patch} from './vdom'
export default class {
  constructor (props, context) {
    this.props = props || {}
    this.context = context || {}
    this.state = {}
  }
  setState (state) {
    this._dirty = true
    this.state = Object.assign({}, this.state, state)
    const $node = this.$node
    for (let i = 0; i < $node.parentNode.childNodes.length; i++) {
      if ($node.parentNode.childNodes[i] === $node) {
        this.vnode = patch($node.parentNode, this.render(), this.vnode, i)
      }
    }
  }

  render () {}

}
