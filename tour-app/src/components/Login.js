import Button from "./Button";
import { useState } from 'react';

function Login() {    
    
    //added use state hooks to keep track of user inputs
    const [uName, setuName] = useState("");
    const [password, setPassword] = useState("");

    let sendCall = () => {
        console.log("Login button clicked!"); //debuging
        console.log("given username:", uName); //debuging 
        console.log("given password:", password); //debuging 
    }


return(
    <div className="container">
        <h1>Login Page</h1>
        <div className="content">                
            <div className="Upload">
                        <input id='input_userName' type='text' placeholder="Enter Username" 
                        value={uName} onChange={(e) => setuName(e.target.value)}></input>
                         <input id='input_password' type='text' placeholder="Enter Password" 
                        value={password} onChange={(e) => setPassword(e.target.value)}></input>              
            </div>
            <div>
                <Button text='Login' onClick= {()=> sendCall()}/>
            </div>
        </div>
    </div>
    )
}
export default Login;