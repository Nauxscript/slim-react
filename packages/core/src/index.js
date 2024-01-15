function createDom(type) {
  return type === 'TEXT_ELEMENT'
  ? document.createTextNode('')
  : document.createElement(type)  
}

function updateProps(el, props) {
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      el[key] = props[key]
    }
  }); 
}

function initChildren(fiber) {
  let prevFiber = null
  fiber.props.children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      dom: null,
      child: null,
      sibling: null,
      parent: fiber 
    }
    if (index === 0) {
      fiber.child = newFiber 
    } else {
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber
  }) 
}

let nextFiber = null

function loop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextFiber) {
    console.log(nextFiber);
    nextFiber = perfromFiberUnit(nextFiber)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(loop)
}

function perfromFiberUnit(fiber) {
  if (!fiber.dom) {
    // create dom
    const el = (fiber.dom = createDom(fiber.type))
    // set props
    updateProps(el, fiber.props)

    // appen
    fiber.parent.dom.append(el)
  }

  initChildren(fiber)  

  if (fiber.child) {
    return fiber.child 
  }

  if (fiber.sibling) {
    return fiber.sibling
  }

  return fiber.parent.sibling
}

function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    } 
  }
}

requestIdleCallback(loop)

export function render(vdom, container) {
  nextFiber = {
    dom: container,
    props: {
      children: [vdom]
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
