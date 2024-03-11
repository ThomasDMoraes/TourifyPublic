import React, {useState, useEffect, useContext} from "react";
import { Link, useLocation } from 'react-router-dom';
import { AccountContext } from "./Account";

//React Bootstrap imports
import Button from '../elements/Button';
import Container from 'react-bootstrap/Container';

//reference: https://medium.com/swlh/how-to-make-a-side-navigation-bar-in-reactjs-c90747f3410c

const SideNavbar = (props) => {
    const location = useLocation();
    const {logout, getUser} = useContext(AccountContext);
    const user = getUser();

    return (
        <Container className="vertical-navbar" style={{width:"10%", paddingTop:"20px"}} >
            <ul className="navbar" style={{listStyle:"none"}}>
                <li className="nav-item"><Link className={"nav-link " + (location.pathname === "/" ? "disabled" : "")} to="/">Home</Link></li> 
                {user && <li className="nav-item"><Link className={"nav-link " + (location.pathname === "/homeLog" ? "disabled" : "")} to="/homeLog">Dashboard</Link></li>}
                <li className="nav-item"><Link className={"nav-link " + (location.pathname === "#<application>" ? "disabled" : "")} to="#<application>">Application</Link></li> 
                {user && <li className="nav-item"><Link className={"nav-link " + (location.pathname === "#<profile>" ? "disabled" : "")} to="#<profile>">Profile</Link></li>}
                {!user && <li className="nav-item"><Link className={"nav-link " + (location.pathname === "/login" ? "disabled" : "")} to="/login">Login</Link></li>}
                {!user && <li className="nav-item"><Link className={"nav-link " + (location.pathname === "/signup" ? "disabled" : "")} to="/signup">Sign Up</Link></li>}
                {user && <li className="nav-item"><Button className="button button-primary" onClick={logout}>Logout</Button></li>} 
            </ul>
        </Container>    
    )
}


export default SideNavbar;