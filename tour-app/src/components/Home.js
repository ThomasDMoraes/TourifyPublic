import * as React from 'react';
import { Link } from 'react-router-dom';
//import {getByTourId, getByTourNameLoc} from "../../api-routes/Services"  //Error: "needs to be inside src folder"

function Home() {
    
    return(
        <div className="container">
            <h1>Home Page</h1>
            <Link to="/search">Search</Link>
            <Link to="/post">Post</Link>
            <Link to="/delete">Delete</Link>
        </div>
    )
}

export default Home;