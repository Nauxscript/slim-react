function CounterContainer() {
  return <div>
    <Counter></Counter>
  </div>  
}

function Counter() {
  return <div>Counter</div> 
}

function App() {
  return (
    <div id='app'>
      <div>
        <span>Hello</span>
        <span>,</span>
      </div>
      <div>Slim React!</div>
      <CounterContainer></CounterContainer>
    </div>
  )  
}

export default App
