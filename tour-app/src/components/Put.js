import Button from "./Button";
import { useState } from 'react';

function Put() {    
    
    //added use state hooks to keep track of user inputs
    const [tid, setTid] = useState("");
    const [tName, setTName] = useState("");
    const [tLoc, setTLoc] = useState("");

    let sendCall = () => {
        console.log("Upload button clicked!"); //debuging
        console.log("given file name:", tid); //debuging 
        console.log("given tour name:", tName); //debuging
        console.log("given tour location:", tLoc); //debuging       
    }

    return(
        <div className="container">
            <h1>Replace file Page</h1>
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
                    <input id='put_file' type='file' value={tLoc} onChange={(e) => setTLoc(e.target.value)}></input>
                </div>
                <div>
                    <Button text='Upload' onClick={sendCall()}/>
                </div>
            </div>
        </div>
        )
}
export default Put;