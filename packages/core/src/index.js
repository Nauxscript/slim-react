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

function commitRoot() {
  commitWork(root.child)
  root = null
}

function commitWork(fiber) {
  if (!fiber) 
    return
  fiber.parent.dom.append(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
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

let root = null

let nextFiber = null

function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextFiber) {
    console.log(nextFiber);
    nextFiber = perfromFiberUnit(nextFiber)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextFiber && root) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

function perfromFiberUnit(fiber) {
  if (!fiber.dom) {
    // create dom
    const el = (fiber.dom = createDom(fiber.type))
    // set props
    updateProps(el, fiber.props)

    // appen
    // fiber.parent.dom.append(el)
  }

  initChildren(fiber)  

  if (fiber.child) {
    return fiber.child 
  }
  
  let prevFiber = fiber
  while (prevFiber) {
    if (prevFiber.sibling)
      return prevFiber.sibling
    prevFiber = prevFiber.parent
    // parentFiber = parentFiber.parent
  }
  // return parentFiber.sibling
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

requestIdleCallback(workLoop)

export function render(vdom, container) {
  nextFiber = {
    dom: container,
    props: {
      children: [vdom]
    }
  }

  root = nextFiber
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
