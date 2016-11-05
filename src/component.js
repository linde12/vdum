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
    console.log('All your base are belong to us', this.vnode.$node)
    debugger;
    const $node = this.vnode.$node
    this.vnode = patch(this.vnode.$node.parentNode, this.render(), this.vnode)
    this.vnode.$node = $node
  }

  render () {}

}
