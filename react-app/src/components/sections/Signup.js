import React, {useState} from "react";
import UserPool from "./UserPool";
import { Link, Redirect, RouteComponentProps } from 'react-router-dom'
import {Auth} from 'aws-amplify';
import Button from "./Button";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");

    let sendInfo = async () => {
        UserPool.signUp(email, password, [], null, (err, data) =>{
            if (err) {
                window.alert("Please enter an appropriate password")
                console.error(err);
            }
            else {
                window.alert("Sign up successful! \nPlease check your email for the verification code and input the code below")             
            }
            console.log(data);
        });     
        
    };

       
    let sendCall = async () => {
        console.log("Confirm button clicked!"); //debuging
        Auth.confirmSignUp(email, code)
        .then(() => {
            window.alert('Succesfully confirmed! \nClick on Sign in');
        })
        .catch(err => {
            window.alert('error', 'Invalid code', err.message);
            
        }); 
    }


    return (
        <div className="container-sm" data-reveal-delay="200">
            <p> </p>
            <h1 className="mt-0 mb-16 reveal-from-bottom">Sign up Page</h1>
            
                <p> </p>
                <label htmlFor="email">Email</label>
                <input type='text' placeholder="Enter Email" 
                            value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <label htmlFor="password"> Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <Button text='Confirm' onClick= {()=> sendInfo()}/>
                <p> </p>
                <p>Password must contain: <br></br>1 uppercase letter <br></br>1 lowercase letter <br></br>1 number <br></br>1 special character</p>
                <h1> </h1>
                <label htmlFor="code">Verification Code</label>
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                ></input>
                <Button text='Confirm' onClick= {()=> sendCall()}/>
                <h1> </h1>
                <Link to="/login">Sign in</Link>
           
        </div>
    );
};

export default Signup;