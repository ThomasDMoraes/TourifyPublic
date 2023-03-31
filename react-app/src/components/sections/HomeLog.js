import * as React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    
    return(
        <div className="container">
            <h1>Home Page</h1>
            <Link to="/search">Search</Link>
            <Link to="/post">  Post</Link>
            <Link to="/delete">  Delete</Link>
            <Link to="/put">  Replace</Link>
        </div>
    )
}

export default Home;