import React, {useState, useContext} from "react";
import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import UserPool from "./UserPool";
import { AccountContext } from "./Account";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {authenticate} = useContext(AccountContext);

    const onSubmit = (event) => {
        event.preventDefault();

        authenticate(email, password)
        .then(data => {
            console.log("Logged in!", data);
            window.location.href = '/homeLog'
        })
        .catch(err => {
            console.error("Failed to login", err);
        })

    };

    return (
        <div className="container-sm" data-reveal-delay="200">
            <h1 className="mt-0 mb-16 reveal-from-bottom">Login Page</h1>
            <form onSubmit={onSubmit}>
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

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;