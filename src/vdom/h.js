export default function (type, props, ...stack) {
  const children = []
  while (stack.length) {
    const child = stack.shift()
    if (child instanceof Array) {
      for (let i = 0; i < child.length; i++) {
        stack.push(child[i])
      }
    } else {
      children.push(child)
    }
  }
  return {type, props: props || {}, children}
}
