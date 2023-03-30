import Button from "./Button";
import React, { useState } from 'react';
import {Amplify, Storage} from 'aws-amplify';
import { Link } from 'react-router-dom'

Amplify.configure({   
    Auth: {
        identityPoolId: 'us-east-1:3e9b7212-4b0b-4d06-b418-cd8ec3dd29db', //REQUIRED - Amazon Cognito Identity Pool ID
        region: 'us-east-1', // REQUIRED - Amazon Cognito Region
        userPoolId: 'us-east-1_xUbKBXTi6', //OPTIONAL - Amazon Cognito User Pool ID
        userPoolWebClientId: '5bo6g3iveh8d6rcmsg7qhd4pka', //OPTIONAL - Amazon Cognito Web Client ID
    }, 
    Storage: {
        AWSS3: {
            bucket: 'tourify-tours', //REQUIRED -  Amazon S3 bucket name
            region: 'us-east-1', //OPTIONAL -  Amazon service region
        }
    }
})

function Post() {    
    
    //added use state hooks to keep track of user inputs
    const [fname, setFname] = useState("");
    const [tName, setTName] = useState("");
    const [tLoc, setTLoc] = useState("");
    const [in_file, setIn_file] = useState('');
    


    let sendCall = () => {
        console.log("Upload button clicked!"); //debuging
        console.log("given tour name:", tName); //debuging
        console.log("given tour location:", tLoc); //debuging
        console.log("given file name:", fname); //debuging    
        console.log("given file:", in_file); //debuging  
        onChange()    
        let getResponse
        getResponse = postTour(tName)  
    }

    async function handleImageAsFile(e){
        console.log("e:",e);
        //image var holds the file object which has a type property 
        const image = e.target.files[0];          
        console.log("image type:",image.type); // this will output the mime, i.e "image/png" or "image/jpg"
        setIn_file(image);
        console.log('file:',in_file);   
     }

    async function onChange() {      
        console.log("given file:", in_file); //debuging  
        
        let fileType = in_file.type

        console.log("given file type:", fileType); //debuging  

        if (fileType.substring(0, 5) != "image" && fileType.substring(0, 5) != "video") {
            console.log("Error: Input files must be of type image or video.");
            window.alert("Error: Input files must be of type image or video.");
            return;
        }

        try {
            await Storage.put("tours/" + in_file.name, in_file, {
                contentType: "image",
            });
        } catch (error){
            console.log("Error uploading file: ", error);
        }
    }    

    async function postTour(tName){
        let uploadKey = in_file.name;
        uploadKey = "tours/"+ uploadKey;
        let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/upload";
        let input_data = {
            'tourName': tName,
            'location': tLoc,
            'key': uploadKey
        };
        console.log("input data:", input_data);
        console.log("url: ", url);
        
        fetch(url, 
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(input_data)
            })
            .then((response) => response.json().then((data) => {
                console.log("response:", response);
                console.log("data:", data);
                window.alert(data.message);
                //document.getElementById("post_res").innerHTML = data.message;
            }))
            .catch((error) => {
                console.log("error:", error);
                window.alert(error);
            })
    }

    return(
        <div className="container">
            <Link to="/homeLog">Home</Link>
            <h1>Post Page</h1>
            <div className="content">                
                <div className="Upload">
                            <input id='input_tourName' type='text' placeholder="Enter Tour Name" 
                            value={tName} onChange={(e) => setTName(e.target.value)}></input>
                            <input id='input_tourLocation' type='text' placeholder="Enter Tour Location" 
                            value={tLoc} onChange={(e) => setTLoc(e.target.value)}></input>
                                         
                </div>
                <div>                       
                    <input id='post_file' type='file' onChange={(e) => handleImageAsFile(e)}></input> 
                </div>
                <div>
                    <Button text='Upload' onClick= {()=> sendCall()}/>
                </div>
            </div>
        </div>
        )
    
}
export default Post;