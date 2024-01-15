export const isFunctionComponent = (componentType) => typeof componentType === 'function'

export const isTextNode = (node) => typeof node === 'number' || typeof node === 'string'