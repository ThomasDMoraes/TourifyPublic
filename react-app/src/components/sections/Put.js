import Button from "./Button";
import React, { useState } from 'react';
import {Amplify, Storage} from 'aws-amplify';
import { Link } from 'react-router-dom';
import ImageMarker, { Marker } from "react-image-marker";

Amplify.configure({   
    Auth: {
        identityPoolId: 'us-east-1:3e9b7212-4b0b-4d06-b418-cd8ec3dd29db', //REQUIRED - Amazon Cognito Identity Pool ID
        region: 'us-east-1', // REQUIRED - Amazon Cognito Region
        userPoolId: 'us-east-1_xUbKBXTi6', //OPTIONAL - Amazon Cognito User Pool ID
        userPoolWebClientId: '5bo6g3iveh8d6rcmsg7qhd4pka', //OPTIONAL - Amazon Cognito Web Client ID
    }, 
    Storage: {
        AWSS3: {
            bucket: 'tourify-tours', //REQUIRED -  Amazon S3 bucket name
            region: 'us-east-1', //OPTIONAL -  Amazon service region
        }
    }
})

function Put() {    
    
    //added use state hooks to keep track of user inputs
    const [tid, setTid] = useState("");
    const [tName, setTName] = useState("");
    const [tLoc, setTLoc] = useState("");
    const [in_file, setIn_file] = useState('');
    const [response, setResponse] = useState("");
    //used for mapping
    const [markers, setMarkers] = useState([]);
    
    let sendCall = async() => {
        //console.log("Upload button clicked!"); //debuging
        //console.log("given file id:", tid); //debuging 
        //console.log("given tour name:", tName); //debuging
        //console.log("given tour location:", tLoc); //debuging    
        let putResponse;
        if(in_file){
            /* //list method can be used to check what's in the bucket. only lists public/ level items. useful for debug.
            Storage.list('').then((res) => {
                console.log("s3 obj list:" , res);
            }).catch((err) => {
                console.log("s3 obj list ERROR:", + err);
            })
            */

            //console.log('file name: ', searchResponse.fileName);
            putResponse = await put(tid, tName, tLoc);
            console.log("put response:", putResponse);
            console.log("status code:", putResponse.status);
            if (putResponse.status && putResponse.status == 200) { //add if status 200 to post file afterwards. also do this for POST method
                onChange();
            }
            
        }
        else {
            putResponse = await put(tid, tName, tLoc);
            console.log('response: ', putResponse);
        }    
                
    }

    //removed getTourByID from here. (now handled in backend)

    async function handleImageAsFile(e){
        //console.log("e:",e);
        //image var holds the file object which has a type property 
        const image = e.target.files[0];          
        //console.log("image type:",image.type); // this will output the mime, i.e "image/png" or "image/jpg"
        setIn_file(image);
        //console.log('file:',in_file);   
     }

    async function onChange() {      
        //console.log("given file:", in_file); //debuging  
        
        let fileType = in_file.type

        //console.log("given file type:", fileType); //debuging  

        if (fileType.substring(0, 5) != "image" && fileType.substring(0, 5) != "video") {
            //console.log("Error: Input files must be of type image or video.");
            window.alert("Error: Input files must be of type image or video.");
            return;
        }

        try {
            await Storage.put("tours/" + in_file.name, in_file, {
                contentType: "image",
            });
        } catch (error){
            console.log("Error uploading file: ", error);
        }
    }    

    async function put(id, tname, loc){
        //console.log("inside button PUT trigger");
        let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/update";
        //also add a condition for file key and file later, like in the new post method
        if (!id || !tname|| !loc) {
            //console.log("PUT parameters incomplete. Canceling post.");
            window.alert("PUT parameters incomplete. Canceling post.");
            return;
        }

        //NOTE: in the future, let partial updates without filling in all of the information.
        //this could be done similarly to how I set the coordinates below.
        let input_data = {
            'id': id,
            'tourName': tname,
            'location': loc,
            'fileName': 'tours/'+in_file.name
        };

        //for map markers
        var coordinates = getCoordinates();
        if (coordinates) {
            input_data['x-coordinate'] = coordinates.X;
            input_data['z-coordinate'] = coordinates.Z;
        }
        //console.log("input data:", input_data);
        //console.log("url: ", url);
                      
        let putRes = await fetch(url, 
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(input_data)
            })
            .then((response) => response.json().then((data) => {
                //console.log("response:", response);
                //console.log("data:", data);
                window.alert(data.message);
                //document.getElementById("put_res").innerHTML = data.message;
                data.status = response.status;
                return data; //returning data and response status code to putRes
            }))
            .catch((error) => {
                console.log("error:", error);
                window.alert(error)
                return error; //error already has a status code
            })
        return putRes; //returning putRes
    }

    //map functions:
    //called on map element
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

    //returns the marker's X/Y coordinates
    const getCoordinates = () => {
        console.log("markers:", markers);
        if (markers[0]) {
            let leftPos = markers[0].left;
            let topPos = markers[0].top;
            console.log("x:", leftPos, " z:", topPos);
            //setCoords({ X:leftPos, Y: topPos });
            return { X: leftPos, Z: topPos };
        } 
    };


    return(
        <div className="container">
            <Link to="/homeLog">Home</Link>
            <h1>Replace info Page</h1>
            <div className="content">                
                <div className="Upload">
                            <input id='input_tourLocation' type='text' placeholder="Enter Tour ID" 
                            value={tid} onChange={(e) => setTid(e.target.value)}></input>  
                            <input id='input_tourName' type='text' placeholder="Enter Tour Name" 
                            value={tName} onChange={(e) => setTName(e.target.value)}></input>   
                            <input id='input_tourLocation' type='text' placeholder="Enter Tour Location" 
                            value={tLoc} onChange={(e) => setTLoc(e.target.value)}></input>                         
                </div>
                <div>
                    <label className="form-label" for="put_file">Video replacement: </label>
                    <input id='put_file' type='file' onChange={(e) => handleImageAsFile(e)}></input>
                </div>
                <div>
                    <Button text='Upload' onClick= {()=> sendCall()}/>
                </div>
                <div id="mapDiv">
                    {/*<p id="coords" value={coords}>X={coords.X} , Y={coords.Y} </p>*/}
                    <ImageMarker
                        src="https://tourify-tours.s3.amazonaws.com/public/maps/map.jpg"
                        markers={markers}
                        onAddMarker={(marker) => {
                            placeMarker(marker);
                        }}
                    />
                </div>
            </div>
            {response !== "" && <div>{response}</div>}
        </div>
        )
}
export default Put;