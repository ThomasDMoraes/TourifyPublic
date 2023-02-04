import Button from "./Button";
import { useState } from 'react';

function Delete() {    
    
    //added use state hooks to keep track of user inputs
    const [tid, setTid] = useState("");

    let sendCall = () => {
        console.log("Delete button clicked!"); //debuging
        console.log("given tour id:", tid); //debuging     
    }

    return(
        <div className="container">
            <h1>Delete Page</h1>
            <div className="content">                
                <div className="Upload">
                            <input id='input_tourName' type='text' placeholder="Enter Tour ID" 
                            value={tid} onChange={(e) => setTid(e.target.value)}></input>
                                          
                </div>
                <div>
                    <Button text='Delete' onClick={sendCall()}/>
                </div>
            </div>
        </div>
        )
}
export default Delete;