import './App.css';
import { useState, useEffect } from 'react';
import Home from './components/Home'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';

const App = () => {
  const [data, setData] = useState({})
  const[tourId, setTourId] = useState("")
  /* useEffect(() => {
    async function getByTourId() {
      console.log('Getting by tour ID...')
      const res = await fetch(`http://localhost:8000/api/tourId/${'d92a08b2-982f-457b-b421-a856929030c9'}`) //tourId instead of string
      if (!res.ok) {
        window.alert(`Unable to fetch tour. Please try again later`)
        return;
      }
      const tourData = await res.json()
            if (!tourData) {
                console.log('Tour is undefined')
            }

            console.log('tour: ', tourData);
            setData(tourData)
    } 
    getByTourId()
  }, []
  )
  */
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>

        {/* <Routes>
          <Route path = '/' elements = {<Home/>} />
        </Routes> */}
      </BrowserRouter>
      <Home/>
    </div>
  );
}

export default App;
