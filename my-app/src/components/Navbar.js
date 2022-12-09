import { Link } from 'react-router-dom';
import Button from './Button';
import { PlusIcon } from '../Icons';

function Navbar() {

    return(
    <nav className = "navbar">
        <div>
            <Link to='/'>Tourality</Link>
        </div>
        <div>
            <Button icon ={PlusIcon} text ="Post"/>
        </div>
    </nav>)
}

export default Navbar;