import logo from './logo.svg';
import './App.css';
import Home from './components/Home'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Link to='/'>Home</Link>

        <Routes>
          <Route path = '/' elements = {<Home/>} />
        </Routes>
      </BrowserRouter>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
