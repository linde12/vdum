import {patch} from './vdom'
export default ($root) => {
  return Object.assign(Object.create({
    render (vtree) {
      vtree = vtree && typeof vtree.render === 'function' ? vtree.render() : vtree;
      this.old = patch(this.$root, vtree, this.old)
    }
  }), {$root})
}
