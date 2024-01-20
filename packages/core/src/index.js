import { isFunctionComponent, isFunction, isTextNode } from "@slim-react/shared";

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
        } else if (key === 'style') {
          console.log(nextProps[key]);
          updateStyle(el, nextProps[key])        
        } else {
          el[key] = nextProps[key]
        }
      }
    }
  }); 
}

function updateStyle(el, styles) {
  if (typeof styles === 'string') {
    el.style = styles
  } else {
    Object.keys(styles).forEach((key) => {
      el.style[key] = styles[key]
    })
  }
}

let wipRoot = null
let currentRoot = null
let nextFiber = null
let wipFiber = null
let deletions = []

function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child) 
  commitEffect()
  // record the previous root to diff with new root when updating
  currentRoot = wipRoot
  wipRoot = null
  deletions = []
}

function commitEffect() {
  wipFiber?.effectHooks.forEach(effect => {
    if (effect.deps) {

      if (effect.deps.length) {
        // only run when deps' item changes
      } else {
        // empty deps, run and only run once
        !wipFiber.alternate && effect.callback()
      }
    } else {
      // has not set deps, run every time component render
      effect.callback()
    }
    // if (effect.deps.length) {
    //   // todo
    //   console.log('has deps');
    // } else if () {
    //   // no deps
    // }

    // if (!wipFiber.alternate) {
    //   effect.callback()
    // } else {
    // }
  })
}

function  commitDeletion(fiber) {
  if (fiber.dom) {
    // removeDomV1(fiber)
    removeDomV2(fiber)
  } else {
    if (fiber.child) {
      commitDeletion(fiber.child)
    }
  } 
}

function removeDomV1(fiber) {
  let parent = fiber.parent
  while(!parent.dom) {
    parent = parent.parent
  }
  parent.dom.removeChild(fiber.dom) 
}

function removeDomV2(fiber) {
  fiber.dom.remove()  
}

function commitWork(fiber) {
  if (!fiber) 
    return
  let parent = fiber.parent
  while(!parent.dom) {
    parent = parent.parent
  }

  if (fiber.effctTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props || {}) 
  } else if (fiber.effctTag === 'placement') {
    if (fiber.dom) {
      parent.dom.append(fiber.dom)
    }
  }
  

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function reconcileChildren(fiber) {
  let prevFiber = null
  let prevFiberChild = fiber.alternate?.child
  fiber.props.children.flat(1).forEach((child, index) => {
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
      if (child) {
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

      if (prevFiberChild) {
        deletions.push(prevFiberChild)
      }
    }
    if (index === 0) {
      fiber.child = newFiber 
    } else {
      prevFiber.sibling = newFiber
    }
    if (prevFiberChild) {
      prevFiberChild = prevFiberChild.sibling
    }
    if (newFiber) {
      prevFiber = newFiber
    }
  })
  while (prevFiberChild) {
    deletions.push(prevFiberChild)
    prevFiberChild = prevFiberChild.sibling
  }
}


function workLoop(deadline) {
  let shouldYield = false

  while (!shouldYield && nextFiber) {
    nextFiber = perfromFiberUnit(nextFiber)
    if (triggeringFiber && nextFiber?.type === triggeringFiber.sibling?.type) {
      nextFiber = undefined
    }
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextFiber && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

function updateFunctionComponent(fiber) {
  currentFiberStateHookIndex = 0
  wipFiber = fiber
  wipFiber.stateHooks = []
  wipFiber.effectHooks = []

  fiber.props.children = [fiber.type(fiber.props)]
  reconcileChildren(fiber)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // create dom
    const el = (fiber.dom = createDom(fiber.type))
    // set props
    updateProps(el, fiber.props, {})
  }

  reconcileChildren(fiber)  
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
  wipRoot = {
    dom: container,
    props: {
      children: [vdom]
    }
  }

  nextFiber = wipRoot
}


let triggeringFiber = null
export function update() {
  const currentFiber = wipFiber 
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextFiber = wipRoot
    triggeringFiber = currentFiber 
  }
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


let currentFiberStateHookIndex = 0
export function useState(initialValue) {
  const currentFiber = wipFiber
  const oldStateHook = currentFiber.alternate?.stateHooks[currentFiberStateHookIndex]
  const stateHook = {
    state: oldStateHook ? oldStateHook.state : initialValue,
    actions: oldStateHook ? oldStateHook.actions : []
  }

  stateHook.actions.forEach(action => {
    stateHook.state = action(stateHook.state)
  })

  stateHook.actions = []

  // save inner statehook
  currentFiber.stateHooks.push(stateHook) 
  currentFiberStateHookIndex++
  
  const setState = (action) => {
    const isFn = isFunction(action)
    const eagerState = isFn ? action(stateHook.state) : action
    if (eagerState === stateHook.state)
      return
    stateHook.actions.push(isFn ? action : () => action)

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }

    triggeringFiber = currentFiber
    nextFiber = wipRoot
  }

  return [stateHook.state, setState]
}

export function useEffect(callback, deps) {
  const currentFiber = wipFiber
  const effectHook = {
    callback,
    deps
  }
  currentFiber.effectHooks.push(effectHook)
}
