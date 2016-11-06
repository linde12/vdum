export const isEventProp = (name) => /^on/.test(name)
export const isCustomProp = (name) => isEventProp(name)
export const isPrimitive = (node) => {
  return typeof node === 'string' ||
    typeof node === 'number' ||
    typeof node === 'boolean'
}

export const isFunction = (vtype) => typeof vtype === 'function'
export const isFunctionalComponent = (vtype) => {
  return isFunction(vtype) &&
    typeof vtype.prototype.render === 'undefined'
}
