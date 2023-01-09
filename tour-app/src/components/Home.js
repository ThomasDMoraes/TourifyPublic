import { SearchIcon } from "../Icons";
import Button from "./Button";
import { useEffect, useState } from 'react';
//import {getByTourId, getByTourNameLoc} from "../../api-routes/Services"  //Error: "needs to be inside src folder"

function Home() {

    const [showId, setShowId] = useState(true);

    //added use state hooks to keep track of user inputs
    const [tid, setTid] = useState("");
    const [tname, setTname] = useState("");
    const [loc, setLoc] = useState("");

    //taken from App.js
    const [data, setData] = useState({})

    //taken from App.js and modified
    async function getByTourId(id) {
        console.log('Getting by tour ID...')
        const res = await fetch("https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/id?id="+id) //tourId instead of string (modified)
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

    //added sendCall to be called when SEARCH button is clicked
    let sendCall = () => {
        console.log("SEARCH button clicked!"); //debuging
        console.log("given tour id:", tid); //debuging
        console.log("given tour name:", tname); //debuging
        console.log("given tour location:", loc); //debuging
        let getResponse;
        if (showId) {
            //getResponse = getByTourId(tid);
            //console.log("response:", getResponse);
        }
        else {
            //getResponse = getByTourNameLoc(tname, loc);
        }
        //console.log("response:", getResponse);
    }


    return(
    <div className="container">
        <h1>Home Page</h1>
        <div className="content">
            <div className = "toggle_buttons">
                <Button text='Search by Tour ID' onClick={() => setShowId(true)}/>
                <Button text='Search by Tour Name & Location' onClick={() => setShowId(false)}/>
            </div>
            <div className="search_inputs">
                {showId ? 
                    <input id='input_tourID' type='text' placeholder="Enter Tour ID"
                    value={tid} onChange={(e) => setTid(e.target.value)}></input>
                    :
                    <>
                        <input id='input_tourName' type='text' placeholder="Enter Tour Name" 
                        value={tname} onChange={(e) => setTname(e.target.value)}></input>
                        <input id='input_tourLocation' type='text' placeholder="Enter Tour Location" 
                        value={loc} onChange={(e) => setLoc(e.target.value)}></input>
                    </>
                }
                
                
            </div>
            <div>
                <Button icon={SearchIcon} text='Search' onClick={sendCall()}/>
            </div>
        </div>
    </div>)
}

export default Home;