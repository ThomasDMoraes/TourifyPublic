import React, { useState, useContext } from 'react';
import {Amplify, Storage} from 'aws-amplify';
//import {ImageMap, getCoordinates} from './ImageMap'; //not using right now, needs to be generalized to use.
import ImageMarker from "react-image-marker";
import UserPool from "./UserPool";
import { TourScriptsContext } from './TourScripts';
//React Bootstrap for grid layout
import Button from '../elements/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
//notification pop-up messages
import {NotificationManager} from 'react-notifications';




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
    //used for mapping
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(false);
    //importing functions instead for more reusability across the app. Commented out the old ones for now.
    const {postTour} = useContext(TourScriptsContext);

    //adding auth to call using user cognito tokens. Make userSession a global variable later so we don't have to use this everywhere.
    const userSession = UserPool.getCurrentUser().getSession((err, session) => {
        if (err) {
            return err;
        }
        else {
            return session;
        }
    })
    //console.log("User Session:", userSession);
    


    let sendCall = async () => {
        if (!tName || !tLoc || !in_file || markers.length < 1) {
            console.log("Missing inputs. Try again");
            NotificationManager.warning("Missing inputs. Make sure all fields are selected and there is a mapped pointer.");
            return;
        }

        console.log("Upload button clicked!"); //debuging
        console.log("given tour name:", tName); //debuging
        console.log("given tour location:", tLoc); //debuging
        console.log("given file name:", fname); //debuging    
        console.log("given file:", in_file); //debuging  
        let tObj = {
            "name": tName,
            "loc": tLoc,
            "coordinatesX": getCoordinates().X,
            "coordinatesZ": getCoordinates().Z
        };
        //let getResponse = await postTour(tName);
        let getResponse = await postTour(tObj, in_file);
        console.log("post status code:", getResponse.status);
        /*
        if (getResponse.status && getResponse.status == 200) {
            onChange() //should be done after confirming the dynamodb post to make sure files are not created unlinked to a database record
        }
        else {
            //DELETE THE TOUR RECORD INSTEAD!
        }
        */
        
    }

    //sets the input file as an image for upload
    async function handleImageAsFile(e){
        console.log("e:",e);
        //image var holds the file object which has a type property 
        const image = e.target.files[0];          
        console.log("image type:",image.type); // this will output the mime, i.e "image/png" or "image/jpg"
        setIn_file(image);
        console.log('file:',in_file);
     }

    //rename this function to fileUpload() or something...
    /*
    async function onChange() {      
        console.log("given file:", in_file); //debuging  
        
        let fileType = in_file.type

        console.log("given file type:", fileType); //debuging  

        if (fileType.substring(0, 5) != "image" && fileType.substring(0, 5) != "video") {
            console.log("Error: Input files must be of type image or video.");
            NotificationManager.error("Error: Input files must be of type image or video.");
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
    */

    /*
    //posts the tour parameters in DynamoDB
    async function postTour(tName){
        let uploadKey = in_file.name;
        uploadKey = "tours/"+ uploadKey;
        let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/upload";
        //getting marker coordinates
        //note: each sphere on unity is around 1 unit long
        //let coordinates = document.getElementById("coords").value; //outdated, keeping commented for reference in case of change.
        var coordinates = getCoordinates();
        if (!coordinates) {
            console.log("POST: NO COORDINATES GIVEN");
            NotificationManager.error("Error: Please try again after marking the tour the map.");
            return;
        }
        console.log("coordinates:", coordinates);

        let input_data = {
            'tourName': tName,
            'location': tLoc,
            'key': uploadKey,
            'x-coordinate': coordinates.X, //current gives errors if they're not given.
            'z-coordinate': coordinates.Z
        };
        console.log("input data:", input_data);
        console.log("url: ", url);
        
        let postRes = await fetch(url, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": userSession.idToken.jwtToken
                },
                body: JSON.stringify(input_data)
            })
            .then((response) => response.json().then((data) => {
                console.log("response:", response);
                console.log("data:", data);
                NotificationManager.success(data.message);
                data.status = response.status;
                return data; //returning data and response status code to putRes
            }))
            .catch((error) => {
                console.log("error:", error);
                NotificationManager.error(error);
                return error; //error already has a status code
            })
        return postRes;
    }
    */

    //map functions:
    //called on map element
    async function placeMarker(marker) {
        console.log("adding marker:", marker);
        markers.push(marker);
        if (markers.length > 1) {
          markers.splice(0, markers.length-1)
        }
        setMarkers([marker]);
        getCoordinates();
        //getCoordinates(markers);
    }

    //returns the marker's X/Y coordinates
    const getCoordinates = () => {
        console.log("markers:", markers);
        if (markers[0]) {
            let leftPos = markers[0].left;
            let topPos = markers[0].top;
            console.log("x:", leftPos, " z:", topPos);
            //setCoords({ X:leftPos, Y: topPos });
            return { X: leftPos, Z: topPos };
        } 
    };

    //basic custom marker use

    //gets current tours for reference on the map / avoid collisions (not implemented yet)
    

    //rendered component (form + map)
    return(
        <Container>
            <h1>Post Page</h1>
            <Card bg="dark" className="text-center">
                <Card.Body>   
                    <Form>
                        <Form.Group controlId="formGroupName" >
                            <Row className="d-flex align-items-center">
                                <Col md="4">
                                    <Form.Label className="form-label"><h3>Name:</h3></Form.Label>
                                </Col>
                                <Col md="6">
                                    <Form.Control className="form-input"
                                        type="text"
                                        placeHolder="Enter tour's name"
                                        value={tName}
                                        onChange={(e) => setTName(e.target.value)}   
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="formGroupLocation">
                            <Row className="d-flex align-items-center">
                                <Col md="4">
                                    <Form.Label className="form-label"><h3>Location:</h3></Form.Label>
                                </Col>
                                <Col md="6">
                                    <Form.Control className="form-input"
                                        type="text"
                                        placeHolder="Enter tour's location"
                                        value={tLoc}
                                        onChange={(e) => setTLoc(e.target.value)}       
                                />
                                </Col>
                            </Row>
                        </Form.Group> 
                        <Form.Group controlId="formGroupFile">
                            <Row className="d-flex align-items-center">
                                <Col md="4">
                                    <Form.Label className="form-label"><h3>Image file:</h3></Form.Label>
                                </Col>
                                <Col md="6">
                                    <Form.Control className="form-input"
                                        type="file"
                                        placeHolder="Enter tour's VR image"
                                        onChange={(e) => handleImageAsFile(e)}      
                                />
                                </Col>
                            </Row>
                        </Form.Group> 
                    </Form>
                    <Button className="my-3" color="primary" loading={loading} onClick={()=> sendCall()} style={{width:"25%"}}>Post</Button>
                </Card.Body>
            </Card>

            <Row className="my-5">
                <Card bg="dark">
                    <Card.Title className="text-center"><h2>Map</h2></Card.Title>
                    <Card.Text><i>Click where the tour is located to map it.</i></Card.Text>
                    <ImageMarker
                        src="https://tourify-tours.s3.amazonaws.com/public/maps/map.jpg"
                        markers={markers}
                        onAddMarker={(marker) => {
                            placeMarker(marker);
                        }}
                    />
                </Card>
            </Row>                  
        </Container>
    )
    
}
export default Post;