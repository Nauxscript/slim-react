export const isFunction = (target) => typeof target === 'function'

export const isFunctionComponent = (componentType) => isFunction(componentType)

export const isTextNode = (node) => typeof node === 'number' || typeof node === 'string'