export function render(vdom, container) {
  const el = vdom.type === 'TEXT_ELEMENT'
              ? document.createTextNode('')
              : document.createElement(vdom.type)
  // set props
  Object.keys(vdom.props).forEach(key => {
    if (key !== 'children') {
      el[key] = vdom.props[key]
    }
  });

  // render children
  vdom.props.children.forEach(child => {
    render(child, el)
  })

  container.append(el)
}

export function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    } 
  }
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(c => typeof c === 'string' ? createTextNode(c) : c)
    }
  } 
}
