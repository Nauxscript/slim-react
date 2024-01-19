import React, { useState } from 'slim-react';

let titleProps = {
  id: 'counter-title',
  style: 'border: 1px solid gray',
  foo: 1
}

function Counter({title}) {
  console.log('%c Rendering: Counter ', 'color: blue', )
  const [num, setNum] = useState(1)
  const handleClick = () => {
    console.log('click');
    // titleProps = {
    //   id: 'counter-title-2',
    //   role: 'title'
    // }
    setNum((oldVal) => ++oldVal)
    // setNum(1)
    // setNum(() => 1)
  }
    
  return <>
    <h3 {...titleProps}>{title}</h3>
    <button onClick={handleClick}> +1 s </button>
    <div> Counter: {num}s </div>
  </> 
}


function ToggleTip() {
  console.log('%c Rendering: ToggleTip ', 'color: green', )

  const [innerTipVisible, setInnerTipVisible] = useState(false)
  const [tailTipVisible, setTailTipVisible] = useState(false)

  const handleToogleInnerTip = () => {
    console.log('handleToogleInnerTip');
    setInnerTipVisible((oldVal) => !oldVal)
  }

  const handleToogleTailTip = () => {
    console.log('handleToogleTailTip');
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
    console.log('handleSwitch');
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
    </div>
  )  
}

export default App
