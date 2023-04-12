import Button from "./Button";
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import ImageMarker, { Marker } from "react-image-marker";

function Search() {
    const [showId, setShowId] = useState(true);

    //added use state hooks to keep track of user inputs
    const [tid, setTid] = useState("");
    const [tname, setTname] = useState("");
    const [loc, setLoc] = useState("");
    const [response, setResponse] = useState("");
    //for image map rendering tours as markers (tentative)
    const [markers, setMarkers] = useState([]);

    //taken from App.js and modified
    async function getByTourId(id) {
        console.log("Id =", id)
        console.log('Getting by tour ID...')
        let res = await fetch("https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/id?id="+id)
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
        return res;               
      } 


      async function getByTourNameLoc(tname, loc) {
        console.log("Tour name =", tname)
        console.log("Location =", loc)
        console.log('Getting by tour Name and location...')
        let res = await fetch("https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/search?tourName=" + tname + "&location=" + loc)
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
        return res;
    }

    //added sendCall to be called when SEARCH button is clicked
    let sendCall = async () => {
        console.log("SEARCH button clicked!"); //debuging
        console.log("given tour id:", tid); //debuging
        console.log("given tour name:", tname); //debuging
        console.log("given tour location:", loc); //debuging
        var getResponse;
        if (showId) {
            getResponse = await getByTourId(tid);
            //console.log("response:", getResponse);
            
        }
        else {
           getResponse = await getByTourNameLoc(tname, loc);
           //loading up response tours into the map
           
        }
        console.log("response:", getResponse);
        setAllMarkers(getResponse);
    }


    //map functions:
    //called on map element
    async function setAllMarkers(tourRecords) {
        //resetting markers
        markers.splice(0, markers.length); // (may be a more efficient way with just setMarker)
        setMarkers([]);
        console.log("Setting marker(s)");
        if (tourRecords[0]) {
            tourRecords.forEach((record) => {
                if (record.X && record.Z) {
                    //console.log("record:", record);
                    //console.log("markers(before):", markers);
                    markers.push({left : record.X, top : record.Z}); //adding the markers (may be a more efficient way with just setMarker)
                    setMarkers([...markers]); //rendering the markers
                }
            });
        }
        else {
            //console.log("markers(before):", markers);
            setMarkers([{left : tourRecords.X, top : tourRecords.Z}]);
        }
    }

    //declaring a custom marker as an improvement
    //should add some onHover change in display for the user experience.
    //hovering over should make it look selected, and pop up some text regarding the marker (tour info)
    //might need to synchronize markers with an array of retrieved tours for this.
    const CustomMarker = (props) => {
        return (
            
            <p 
            className="image-marker__marker image-marker__marker--default tour-marker" 
            style = {{
                color: "black",
                border: '2px solid black'  
            }} 
            >Tour ID - {props.itemNumber}</p>
        )
    }

    return(
    <div className="container">
        <Link to="/homeLog">Home</Link>
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
                <Button text='Search' onClick= {()=> sendCall()}/>
            </div>

            {response !== "" && <div>{response}</div>}

            <div id="mapDiv">
                <ImageMarker
                    src="https://tourify-tours.s3.amazonaws.com/public/maps/map.jpg"
                    markers={markers}
                    markerComponent={CustomMarker}
                />
            </div>

        </div>
    </div>
    )
}
export default Search;
