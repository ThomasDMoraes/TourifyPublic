import Button from "./Button";
import { useState } from 'react';

function Post() {    
    
    //added use state hooks to keep track of user inputs
    const [fname, setFname] = useState("");
    const [tName, setTName] = useState("");
    const [tLoc, setTLoc] = useState("");

    let sendCall = () => {
        console.log("Upload button clicked!"); //debuging
        console.log("given tour name:", tName); //debuging
        console.log("given tour location:", tLoc); //debuging
        console.log("given file name:", fname); //debuging        
    }

    return(
        <div className="container">
            <h1>Post Page</h1>
            <div className="content">                
                <div className="Upload">
                            <input id='input_tourName' type='text' placeholder="Enter Tour Name" 
                            value={tName} onChange={(e) => setTName(e.target.value)}></input>
                            <input id='input_tourLocation' type='text' placeholder="Enter Tour Location" 
                            value={tLoc} onChange={(e) => setTLoc(e.target.value)}></input>
                            <input id='input_tourLocation' type='text' placeholder="Enter File Name" 
                            value={fname} onChange={(e) => setFname(e.target.value)}></input>                    
                </div>
                <div>
                    <Button text='Upload' onClick={sendCall()}/>
                </div>
            </div>
        </div>
        )
}
export default Post;