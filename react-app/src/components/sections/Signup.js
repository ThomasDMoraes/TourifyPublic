import React, {useState} from "react";
import UserPool from "./UserPool";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (event) => {
        event.preventDefault();
        UserPool.signUp(email, password, [], null, (err, data) =>{
            if (err) {
                console.error(err);
            }
            console.log(data);
        });
    };

    return (
        <div className="container-sm" data-reveal-delay="200">
            <h1 className="mt-0 mb-16 reveal-from-bottom">Sign up Page</h1>
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

                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;