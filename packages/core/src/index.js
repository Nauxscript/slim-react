import { isFunctionComponent, isTextNode } from "@slim-react/shared";

function createDom(type) {
  return type === 'TEXT_ELEMENT'
  ? document.createTextNode('')
  : document.createElement(type)  
}

function updateProps(el, props) {
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      if (key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase()
        el.addEventListener(eventType, props[key]) 
      } else {
        el[key] = props[key]
      }
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
  let parent = fiber.parent
  while(!parent.dom) {
    parent = parent.parent
  }

  if (fiber.dom) {
    parent.dom.append(fiber.dom)
  }

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
    nextFiber = perfromFiberUnit(nextFiber)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextFiber && root) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

function updateFunctionComponent(fiber) {
  fiber.props.children = [fiber.type(fiber.props)]
  initChildren(fiber)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // create dom
    const el = (fiber.dom = createDom(fiber.type))
    // set props
    updateProps(el, fiber.props)
  }

  initChildren(fiber)  
}

function perfromFiberUnit(fiber) {
  if (isFunctionComponent(fiber.type)) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child 
  }
  
  let prevFiber = fiber
  while (prevFiber) {
    if (prevFiber.sibling)
      return prevFiber.sibling
    prevFiber = prevFiber.parent
  }
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
      children: children.map(c => isTextNode(c) ? createTextNode(c) : c)
    }
  } 
}

