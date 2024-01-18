let num = 10
let titleProps = {
  id: 'counter-title',
  style: 'border: 1px solid gray',
  foo: 1
}

function Counter({title}) {
  const handleClick = () => {
    console.log('click');
    titleProps = {
      id: 'counter-title-2',
      role: 'title'
    }
    num++
    React.update()
  }
    
  return <>
    <h3 {...titleProps}>{title}</h3>
    <button onClick={handleClick}> +1 s </button>
    <div> Counter: {num}s </div>
  </> 
}

let innerTipVisible = false
let TailTipVisible = false
function ToggleTip() {

  const handleToogleInnerTip = () => {
    console.log('handleToogleInnerTip');
    innerTipVisible = !innerTipVisible 
    React.update()
  }

  const handleToogleTailTip = () => {
    console.log('handleToogleTailTip');
    TailTipVisible = !TailTipVisible 
    React.update()
  }

  const Tip = ({title}) => <span>{title}</span>

  return <div>
    <button onClick={handleToogleInnerTip}>Toggle the inner tip</button>
    {innerTipVisible && <Tip title="Inner Tip"></Tip>}
    
    <button onClick={handleToogleTailTip}>Toggle the tail tip</button>
    {TailTipVisible && <Tip title="Tail Tip"></Tip>}
  </div>
}

let isFirstTip = true
function ConditionTip() {
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
    isFirstTip = !isFirstTip 
    React.update()
  }

  return (
    <div>
      <button onClick={handleSwitch}>Switch Tip</button>
      {isFirstTip ? First : Second }
    </div>
  )
}

function FeatureBlock({title, children}) {
  
  return (
    <section>
      <h2>{title}</h2>
      {...children}
      <hr></hr>
    </section>
  )
}

function App() {
  return (
    <div id='app'>
      <div>
        <h1>
          <span>Hello, </span>
          <span>Slim React!</span>
        </h1>
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
