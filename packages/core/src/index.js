import { isFunctionComponent, isTextNode } from "@slim-react/shared";

function createDom(type) {
  return type === 'TEXT_ELEMENT'
  ? document.createTextNode('')
  : document.createElement(type)  
}

function updateProps(el, nextProps, prevProps) {

  Object.keys(prevProps).forEach((key) => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        el.removeAttribute(key)
      }
    }
  })

  Object.keys(nextProps).forEach(key => {
    if (key !== 'children') {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith('on')) {
          const eventType = key.slice(2).toLowerCase()
          // event listener dedupe
          el.removeEventListener(eventType, prevProps[key])
          el.addEventListener(eventType, nextProps[key]) 
        } else {
          el[key] = nextProps[key]
        }
      }
    }
  }); 
}

let root = null
let currentRoot = null
let nextFiber = null

function commitRoot() {
  commitWork(root.child)
  // record the previous root to diff with new root when updating
  currentRoot = root
  root = null
}

function commitWork(fiber) {
  if (!fiber) 
    return
  let parent = fiber.parent
  while(!parent.dom) {
    parent = parent.parent
  }

  if (fiber.effctTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props) 
  } else if (fiber.effctTag === 'placement') {
    if (fiber.dom) {
      parent.dom.append(fiber.dom)
    }
  }
  

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function initChildren(fiber) {
  let prevFiber = null
  let prevFiberChild = fiber.alternate?.child
  fiber.props.children.forEach((child, index) => {
    let newFiber
    const isSameType = prevFiberChild && child.type === prevFiberChild.type
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        dom: prevFiberChild.dom,
        child: null,
        sibling: null,
        parent: fiber,
        effctTag: 'update',
        alternate: prevFiberChild
      }
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        dom: null,
        child: null,
        sibling: null,
        parent: fiber,
        effctTag: 'placement'
      }
    }
    if (index === 0) {
      fiber.child = newFiber 
    } else {
      prevFiber.sibling = newFiber
    }
    prevFiberChild = prevFiberChild?.sibling
    prevFiber = newFiber
  }) 
}


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
    updateProps(el, fiber.props, {})
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

export function update() {
  nextFiber = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot
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

