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
    <h2 {...titleProps}>{title}</h2>
    <button onClick={handleClick}> +1 s </button>
    <div> Counter: {num}s </div>
  </> 
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
      <Counter title="This is a freaking counter" ></Counter>
    </div>
  )  
}

export default App
