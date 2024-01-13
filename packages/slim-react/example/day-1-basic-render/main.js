// ------------ target -------------
// import { createRoot } from 'react-dom/client';

// function App() {
//   return <h1>app</h1>;
// }

// const app = document.getElementById('#app');
// const root = createRoot(app);
// root.render(<App />);

// v1 original way to render
// const root = document.getElementById('root')
// const app = document.createElement('div')
// app.id = 'app'

// const textEle = document.createTextNode('')
// textEle.nodeValue = 'Hello, Slim React!'

// app.append(textEle)
// root.append(app)

// v2 virtual dom to real dom

import { createRoot } from '../dist/slim-react.esm-bundler.js';
import App from './App.js';

createRoot(document.getElementById('root')).render(App)
