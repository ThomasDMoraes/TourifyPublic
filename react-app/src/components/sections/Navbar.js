import { Link } from 'react-router-dom';
import React from 'react';

function Navbar() {

    return(
    <nav className = "navbar">
        <div>
            <Link to='/homeLog'>Tourality</Link>
        </div>
    </nav>)
}

export default Navbar;