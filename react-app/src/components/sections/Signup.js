import React, {useState} from "react";
import UserPool from "./UserPool";
import { Link } from 'react-router-dom'

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (event) => {
        event.preventDefault();
        UserPool.signUp(email, password, [], null, (err, data) =>{
            if (err) {
                window.alert("Please enter an appropriate password")
                console.error(err);
            }
            else {
                window.alert("Sign up successful! \nClick on Sign in")
            }
            console.log(data);
            
        });
    };

    return (
        <div className="container-sm" data-reveal-delay="200">
            <p> </p>
            <h1 className="mt-0 mb-16 reveal-from-bottom">Sign up Page</h1>
            <form onSubmit={onSubmit}>
                <p> </p>
                <label htmlFor="email">Email</label>
                <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                ></input>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                ></input>
                <button type="submit">Signup</button>
                <p> </p>
                <p>Password must contain <br></br>1 uppercase letter <br></br>1 lowercase letter <br></br>1 number <br></br>1 special character</p>
                <h1> </h1>
                <Link to="/login">Sign in</Link>
            </form>
        </div>
    );
};

export default Signup;