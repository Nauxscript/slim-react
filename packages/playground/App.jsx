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
    </div>
  )  
}

export default App
