import React, { useState } from 'react';
import ImageMarker, { Marker } from "react-image-marker";


const ImageMap = () => {
    const [markers, setMarkers] = useState([]);
    //const [mapImg, setMapImg] = useState(null);
  
    const getCoordinates = () => {
      let myDiv = document.getElementById("mapDiv");
      let leftPos = markers[0].left;
      let topPos = markers[0].top;
      console.log("x:", leftPos, " y:", topPos);
      return { X: leftPos, Y: topPos };
    };
  
    return (
      <div id="mapDiv">
        <ImageMarker
          src="https://tourify-tours.s3.amazonaws.com/public/maps/map.jpg"
          markers={markers}
          onAddMarker={(marker) => {
            setMarkers([marker]);
            getCoordinates();
          }}
        />
      </div>
    );
}

export default ImageMap;
