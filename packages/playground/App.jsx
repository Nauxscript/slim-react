import React, { useState, useEffect } from 'slim-react';

function Counter({title}) {
  console.log('%c Rendering: Counter ', 'color: blue', )
  const [num, setNum] = useState(0)
  const [attr, setAttr] = useState({
    id: 'counter-title',
    style: 'border-radius: 4px;padding: 2px;border: 2px solid gray;',
    foo: 1
  })
  const handleClick = () => {
    setAttr(() => ({role: 'title', style: `border-radius: 4px;padding: 2px;border: 2px solid ${num % 2 === 0 ? 'blue' : 'gray'}`}))
    setNum((oldVal) => ++oldVal)
  }
    
  return <div>
    <h3 {...attr}>{title}</h3>
    <button onClick={handleClick}> +1 s </button>
    <div> Counter: {num}s </div>
  </div> 
}


function ToggleTip() {
  console.log('%c Rendering: ToggleTip ', 'color: green', )

  const [innerTipVisible, setInnerTipVisible] = useState(false)
  const [tailTipVisible, setTailTipVisible] = useState(false)

  const handleToogleInnerTip = () => {
    setInnerTipVisible((oldVal) => !oldVal)
  }

  const handleToogleTailTip = () => {
    setTailTipVisible((oldVal) => !oldVal) 
  }

  const Tip = ({title}) => <span>{title}</span>

  return <div>
    <button onClick={handleToogleInnerTip}>Toggle the inner tip</button>
    {innerTipVisible && <Tip title="Inner Tip"></Tip>}
    
    <button onClick={handleToogleTailTip}>Toggle the tail tip</button>
    {tailTipVisible && <Tip title="Tail Tip"></Tip>}
  </div>
}

function ConditionTip() {
  console.log('%c Rendering: ConditionTip ', 'color: green', )

  const [isFirstTip, setIsFirstTip] = useState(true)

  const First = ( 
    <div>First Tip</div>   
  )

  const Second = (
    <div>
      <span>Second Tip</span>
      <p>Second Tip Description</p>
      <p>Second Tip Another Description</p>
    </div>
  )
    
  const handleSwitch = () => {
    setIsFirstTip((oldVal) => !oldVal)
  }

  return (
    <div>
      <button onClick={handleSwitch}>Switch Tip</button>
      {isFirstTip ? First : Second }
    </div>
  )
}

function FeatureBlock({title, children}) {
  console.log('%c Rendering: FeatureBlock ', 'color: pink', )  
  return (
    <section>
      <h2>{title}</h2>
      {...children}
      <hr></hr>
    </section>
  )
}

function Todo() {
  const [inputValue, setInputValue] = useState('')
  const [todos, setTodos] = useState([])
  const [incompletedCount, setIncompletedCount] = useState(todos.length)

  const handleAdd = (e) => {
    if (e.key === 'Enter') {
      setTodos(oldList => ([...oldList, {
        title: e.target.value,
        completed: false,
      }]))
      setInputValue('')
    }
  }

  const handleDelete = (currIndex) => {
    setTodos(oldList => oldList.filter((item, index) => index !== currIndex))
  }

  const handleComplete = (currIndex) => {
    console.log('completed');
    setTodos(oldList => oldList.map((todo, index) => {
      if (currIndex === index) {
        return {...todo, completed: !todo.completed}
      }
      return todo
    }))
  }

  useEffect(() => {
    console.log('run and only run once');
  }, [])

  useEffect(() => {
    console.log('run every time component render');
    return function() {
      console.log('cleanup every compoent rerendering'); 
    }
  })

  useEffect(() => {
    console.log("run when deps' item changes or the component first rendering");
    setIncompletedCount(todos.length) 
    return function() {
      console.log('cleanup only todos.length change');
    }
  }, [todos.length])

  return <div>
    <input value={inputValue} type="text" onKeyUp={handleAdd} onInput={(e) => setInputValue(e.target.value)} placeholder='what do you want to do today?' />
    <div>一共有 {incompletedCount} 个任务</div>
    <ul>
      {
        todos.map((todo, index) => <li>
            <span style={{padding: '4px', textDecorationLine: todo.completed ? 'line-through' : 'none'}}>{todo.title}</span>
            <button onClick={() => handleComplete(index)}>{ todo.completed ? '❎' : '✅'}</button>
            <button onClick={() => handleDelete(index)}>✖️</button>
          </li>)
      }
    </ul>
  </div> 
}

function App() {
  console.log('%c Rendering: App ', 'color: red')
  // Slim React!
  const titles = [
    'Hi, my name is, what?',
    'My name is, who?',
    'My name is, chka-chka...',
    'Slim React! 🤣'
  ]
  const [titleIndex, setTitleIndex] = useState(0)

  const rap = () => {
    setTitleIndex(() => titleIndex === 3 ? 0 : titleIndex + 1)
  }
  
  return (
    <div id='app'>
      <div>
        <h1 style="cursor: pointer; user-select: none;" onClick={rap}>{titles[titleIndex]}</h1>
      </div>
      <FeatureBlock title="Update Props">
        <Counter title="This is a freaking counter" ></Counter>
      </FeatureBlock>      
      <FeatureBlock title="Update Children">
        <ToggleTip></ToggleTip>
        <ConditionTip></ConditionTip>
      </FeatureBlock>
      <FeatureBlock title="UseEffect">
        <Todo></Todo>
      </FeatureBlock>
    </div>
  )  
}

export default App
