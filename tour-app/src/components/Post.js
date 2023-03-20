import Button from "./Button";
import { useState } from 'react';

function Post() {    
    
    //added use state hooks to keep track of user inputs
    const [fname, setFname] = useState("");
    const [tName, setTName] = useState("");
    const [tLoc, setTLoc] = useState("");
    const [file, setFile] = useState([]);


    let sendCall = () => {
        console.log("Upload button clicked!"); //debuging
        console.log("given tour name:", tName); //debuging
        console.log("given tour location:", tLoc); //debuging
        console.log("given file name:", fname); //debuging    
        
        
    }

   
    
    async function onChange(e) {
        
        const file = e.target.files[0];

        let fileType = file.type

        if (fileType.substring(0, 5) != "image" && fileType.substring(0, 5) != "video") {
            console.log("Error: Input files must be of type image or video.");
            window.alert("Error: Input files must be of type image or video.");
            return;
        }

        try {
            await Storage.put(file.name, file, {
                contentType: fileType.substring(0,5),
            });
        } catch (error){
            console.log("Error uploading file: ", error);
        }
    }
    

    return(
        <div className="container">
            <h1>Post Page</h1>
            <div className="content">                
                <div className="Upload">
                            <input id='input_tourName' type='text' placeholder="Enter Tour Name" 
                            value={tName} onChange={(e) => setTName(e.target.value)}></input>
                            <input id='input_tourLocation' type='text' placeholder="Enter Tour Location" 
                            value={tLoc} onChange={(e) => setTLoc(e.target.value)}></input>
                                         
                </div>
                <div>
                    <input id='input_tourLocation' type='text' placeholder="Enter File Name" 
                    value={fname} onChange={(e) => setFname(e.target.value)}></input>    
                    <input id='post_file' type='file' value={file} onChange={(e) => setFile(e.target.value)}></input>   
                </div>
                <div>
                    <Button text='Upload' onClick={sendCall()}/>
                </div>
            </div>
        </div>
        )
}
export default Post;