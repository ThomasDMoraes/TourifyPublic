import { SearchIcon } from "../Icons";
import Button from "./Button";
import { useEffect, useState } from 'react';

function Home() {

    const [showId, setShowId] = useState(true)

    return(
    <div className="container">
        <h1>Home Page</h1>
        <div className="content">
            <div className = "toggle_buttons">
                <Button text='Search by Tour ID' onClick={() => setShowId(true)}/>
                <Button text='Search by Tour Name & Location' onClick={() => setShowId(false)}/>
            </div>
            <div className="search_inputs">
                {showId ? 
                    <input id='input_tourID' type='text' placeholder="Enter Tour ID"></input>
                    :
                    <>
                        <input id='input_tourName' type='text' placeholder="Enter Tour Name"></input>
                        <input id='input_tourLocation' type='text' placeholder="Enter Tour Location"></input>
                    </>
                }
                
                
            </div>
            <div>
                <Button icon={SearchIcon} text='Search'/>
            </div>
        </div>
    </div>)
}

export default Home;