import React, {useState, useContext} from "react";
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
            window.alert("Incorrect login information")
            console.error("Failed to login", err);
        })

    };

    return (
        <div className="container-sm" data-reveal-delay="200">
            <p> </p>
            <h1 className="mt-0 mb-16 reveal-from-bottom">Login Page</h1>
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

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;