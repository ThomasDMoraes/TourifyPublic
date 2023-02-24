import { SearchIcon } from "../Icons";
import Button from "./Button";
import { useEffect, useState } from 'react';

function Search() {
    const [showId, setShowId] = useState(true);

    //added use state hooks to keep track of user inputs
    const [tid, setTid] = useState("");
    const [tname, setTname] = useState("");
    const [loc, setLoc] = useState("");
    const [response, setResponse] = useState("");

    //taken from App.js
    const [tData, setData] = useState({})

    //taken from App.js and modified
    async function getByTourId(id) {
        console.log("Id =", id)
        console.log('Getting by tour ID...')
        fetch("https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/id?id="+id)
        .then((response) => response.json().then((tData) => {
            console.log("response:", response);
            console.log("data:", tData);

            let str, str2;
            if (tData.id) { //match found
                //pop-up string
                str = "ID: " + tData.id + "\nTour: " + tData.tourName + "\nLocation: " + tData.location +
                (tData.url ? "\nURL: " + tData.url : "") + "\n\n";
                //paragraph string
                str2 = "ID: " + tData.id + "<br/>Tour: " + tData.tourName + "<br/>Location: " + tData.location +
                (tData.url ? "<br/>URL: " + tData.url : "") + "<br/> <br/>";
                window.alert(str);
                //document.getElementById("getId_res").innerHTML = str2;
            }
           else {
                window.alert(tData.message)
           }

           setResponse(str2);
           return tData;
        })) 

        //tourId instead of string (modified)
        /*if (!res.ok) {
          window.alert('Unable to fetch tour. Please try again later')
          return;
        }
        const tourData = await res.json()
              if (!tourData) {
                  console.log('Tour is undefined')
              }
  
              console.log('tour: ', tourData);
              setData(tourData)
              return data;
              */
            
      } 


      async function getByTourNameLoc(tname, loc) {
        console.log("Tour name =", tname)
        console.log("Location =", loc)
        console.log('Getting by tour Name and location...')
        fetch("https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/search?tourName=" + tname + "&location=" + loc)
        .then((response) => response.json().then((tData) => {
            console.log("response:", response);
            console.log("data:", tData);

            let str, str2;
            str = ""; //pop-up string
            str2 = ""; //html paragraph string
            tData.forEach(tour => { //use map(props) for ReactJS instead onto a table, grid, or whatever 
            str += "ID: " + tour.id + "\nTour: " + tour.tourName + "\nLocation: " + tour.location +
            (tour.url ? "\nURL: " + tour.url : "") + "\n\n";

            //first character of every line is cut for some reason, so I'm putting a random character there.
            str2 += "aID: " + tour.id + "<br/>aTour: " + tour.tourName + "<br/>aLocation: " + tour.location +
            (tour.url ? "<br/>aURL: " + tour.url : "") + "<br/> <br/>";
            });
            window.alert(str);
            setResponse(str2);
            return tData;
        })) 
    }

    //added sendCall to be called when SEARCH button is clicked
    let sendCall = () => {
        console.log("SEARCH button clicked!"); //debuging
        console.log("given tour id:", tid); //debuging
        console.log("given tour name:", tname); //debuging
        console.log("given tour location:", loc); //debuging
        let getResponse;
        if (showId) {
            getResponse = getByTourId(tid);
            //console.log("response:", getResponse);
            
        }
        else {
           getResponse = getByTourNameLoc(tname, loc);
        }
        //console.log("response:", getResponse);
    }


    return(
    <div className="container">
        <h1>Search Page</h1>
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
                <Button icon={SearchIcon} text='Search' onClick= {()=> sendCall()}/>
            </div>

            {response !== "" && <div>{response}</div>}
        </div>
    </div>
    )
}
export default Search;