import Button from "./Button";
import React, { useState } from 'react';
import { Link } from 'react-router-dom'

function Put() {    
    
    //added use state hooks to keep track of user inputs
    const [tid, setTid] = useState("");
    const [tName, setTName] = useState("");
    const [tLoc, setTLoc] = useState("");
    const [file, setfile] = useState("");

    let sendCall = () => {
        console.log("Upload button clicked!"); //debuging
        console.log("given file id:", tid); //debuging 
        console.log("given tour name:", tName); //debuging
        console.log("given tour location:", tLoc); //debuging    
        let getResponse
        getResponse = put(tid, tName, tLoc);    
    }

    async function put(id, tname, loc){
        console.log("inside button PUT trigger");
        let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/update";
        //also add a condition for file key and file later, like in the new post method
        if (!id || !tname|| !loc) {
            console.log("PUT parameters incomplete. Canceling post.");
            window.alert("PUT parameters incomplete. Canceling post.");
            return;
        }
        let input_data = {
            'id': id,
            'tourName': tname,
            'location': loc
        };
        console.log("input data:", input_data);
        console.log("url: ", url);
        
    
    
        
        fetch(url, 
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(input_data)
            })
            .then((response) => response.json().then((data) => {
                console.log("response:", response);
                console.log("data:", data);
                window.alert(data.message);
                //document.getElementById("put_res").innerHTML = data.message;
            }))
            .catch((error) => {
                console.log("error:", error);
                window.alert(error);
            })
    }

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
                    <input id='put_file' type='file' value={file} onChange={(e) => setfile(e.target.value)}></input>
                </div>
                <div>
                    <Button text='Upload' onClick= {()=> sendCall()}/>
                </div>
            </div>
        </div>
        )
}
export default Put;