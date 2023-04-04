import React, { useState } from 'react';
import ImageMarker, { Marker } from "react-image-marker";
//import { createContext } from 'react';

/*
const getCoordinates = (markerArr) => {
  //let myDiv = document.getElementById("mapDiv");
  console.log("markers:", markerArr);
  if (!markerArr) {
    markerArr;
  }
  if (markerArr[0]) {
    let leftPos = markerArr[0].left;
    let topPos = markerArr[0].top;
    console.log("x:", leftPos, " y:", topPos);
    return { X: leftPos, Y: topPos };
  } 
};
*/

//const markerContext = createContext([]); //could try use this to carry over same map without re-rendering and put functions here

const ImageMap = () => {
    const [markers, setMarkers] = useState([]);
    const [coords, setCoords] = useState({X: 0, Y: 0}); //coordinates to be shown on Div (used to link coordinates to other pages for now)
    //const [mapImg, setMapImg] = useState(null);

  
    const getCoordinates = () => {
      //let myDiv = document.getElementById("mapDiv");
      console.log("markers:", markers);
      if (markers[0]) {
        let leftPos = markers[0].left;
        let topPos = markers[0].top;
        console.log("x:", leftPos, " y:", topPos);
        setCoords({ X:leftPos, Y: topPos });
        return { X: leftPos, Y: topPos };
      } 
    };
  

    //pointer on map set by setMarkers is always ahead by 1 click for some reason, so I'm adding it to the markers array and setting the pointer later
    //this way, the coordinates and point shown on the map are correlating.
    //may need to change this in the future for other things, or find out how to actually fix the problem normally.
    async function placeMarker(marker) {
      console.log("adding marker:", marker);
      markers.push(marker);
      if (markers.length > 1) {
        markers.splice(0, markers.length-1)
      }
      setMarkers([marker]);
      getCoordinates();
      //getCoordinates(markers);
    }
    
  

    return (
      <div id="mapDiv">
        <p id="coords" value={coords}>X={coords.X} , Y={coords.Y} </p>
        <ImageMarker
          src="https://tourify-tours.s3.amazonaws.com/public/maps/map.jpg"
          markers={markers}
          onAddMarker={(marker) => {
            placeMarker(marker);
          }}
        />
      </div>
    );
}

export {ImageMap};
