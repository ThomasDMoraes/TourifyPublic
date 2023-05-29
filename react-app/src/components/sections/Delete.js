import Button from "./Button";
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import UserPool from "./UserPool";

function Delete() {    
    
    //added use state hooks to keep track of user inputs
    const [tid, setTid] = useState("");

    //adding auth to call using user cognito tokens. Make userSession a global variable later so we don't have to use this everywhere.
    const userSession = UserPool.getCurrentUser().getSession((err, session) => {
        if (err) {
            return err;
        }
        else {
            return session;
        }
    })
    //console.log("User Session:", userSession);

    let sendCall = () => {
        console.log("Delete button clicked!"); //debuging
        console.log("given tour id:", tid); //debuging 
        let getResponse
        getResponse = delByTourId(tid);    
    }

    async function delByTourId(id) {
        console.log("inside button DELETE trigger");
        let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/delete?id="+id;
        console.log("id: ", id);
        console.log("url: ", url);
        if (!id) {
            console.log("DELETE parameters incomplete. Canceling request.");
            window.alert("DELETE parameters incomplete. Canceling request.");
            return;
        }
        
        fetch(url, 
            {
                method: 'DELETE',
                headers: {
                    "Authorization": userSession.idToken.jwtToken
                }
            })
            .then((response) => response.json().then((data) => {
                console.log("response:", response);
                console.log("data:", data);
                window.alert(data.message);
                //document.getElementById("del_res").innerHTML = data.message;
            }))
            .catch((error) => {
                console.log("error:", error);
                window.alert(error);
            })
    }
    
    return(
        <div className="container">
            <Link to="/homeLog">Home</Link>
            <h1>Delete Page</h1>
            <div className="content">                
                <div className="Upload">
                            <input id='input_tourName' type='text' placeholder="Enter Tour ID" 
                            value={tid} onChange={(e) => setTid(e.target.value)}></input>
                                          
                </div>
                <div>
                    <Button text='Delete' onClick= {()=> sendCall()}/>
                </div>
            </div>
        </div>
        )
}
export default Delete;