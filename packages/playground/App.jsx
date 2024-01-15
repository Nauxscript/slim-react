function CounterContainer({num}) {
  return <div>
    <Counter num={num}></Counter>
  </div>  
}

function Counter({num}) {
  return <div>Counter: {num}</div> 
}

function App() {
  return (
    <div id='app'>
      <div>
        <span>Hello</span>
        <span>,</span>
      </div>
      <div>Slim React!</div>
      <CounterContainer num={10} ></CounterContainer>
      <CounterContainer num={20} ></CounterContainer>
    </div>
  )  
}

export default App
