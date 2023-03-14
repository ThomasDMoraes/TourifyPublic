import './App.css';
import Home from './components/Home';
import Search from './components/Search';
import Post from './components/Post';
import Delete from './components/Delete';
import Put from './components/Put';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

const App = () => {

  /*
   useEffect(() => {
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
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="post" element={<Post />} />
          <Route path="delete" element={<Delete />} />
          <Route path="put" element={<Put />} />
          <Route path="login" element={<Login />} />
        </Routes>
    </div>
  );
}

export default App;
