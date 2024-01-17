function Counter({num}) {

  const handleClick = () => {
    console.log('click');
  }
    
  return <>
    <button onClick={handleClick}> +1 s </button>
    <div> Counter: {num}s </div>
  </> 
}

function App() {
  return (
    <div id='app'>
      <div>
        <span>Hello</span>
        <span>,</span>
      </div>
      <div>Slim React!</div>
      <Counter num={10} ></Counter>
    </div>
  )  
}

export default App
