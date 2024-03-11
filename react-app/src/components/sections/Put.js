import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {Amplify, Storage} from 'aws-amplify';
import ImageMarker, { Marker } from "react-image-marker";
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

function Put(props) {    
    //added use state hooks to keep track of user inputs
    const location = useLocation();
    const [tid, setTid] = useState("");
    const [tName, setTName] = useState("");
    const [tLoc, setTLoc] = useState("");
    const [in_file, setIn_file] = useState("");
    
    //used for mapping
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(false);
    //importing functions instead for more reusability across the app. Commented out the old ones for now.
    const {updateTour} = useContext(TourScriptsContext);

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

    useEffect(() => {
        //used for scrolling up when redirecting
        window.scrollTo(0,0);
        //passed props from Search page's UPDATE button, if any.
        if (location && location.state && location.state.tour) {
            if (location.state.tour.id) {setTid(location.state.tour.id)}
            if (location.state.tour.tourName) {setTName(location.state.tour.tourName)};
            if (location.state.tour.location) {setTLoc(location.state.tour.location)};
            if (location.state.tour.X && location.state.tour.Z) {
                console.log("X:", location.state.tour.X, "Z:", location.state.tour.Z);
                placeMarker({
                    left : parseFloat(location.state.tour.X),
                    top : parseFloat(location.state.tour.Z)
                })
            }
        }
    }, [props])

    //triggered to send inputs with update method
    let sendCall = async() => {
        //console.log("Upload button clicked!"); //debuging
        //console.log("given file id:", tid); //debuging 
        //console.log("given tour name:", tName); //debuging
        //console.log("given tour location:", tLoc); //debuging    
        setLoading(true);
        let tObj = {
            "id": tid,
        };
        if (tName) {tObj.tourName = tName;}
        if (tLoc) {tObj.location = tLoc;}
        if (getCoordinates()) {
            tObj["x-coordinate"] = getCoordinates().X;
            tObj["z-coordinate"] = getCoordinates().Z;
        };
        let putResponse = await updateTour(tObj, in_file);
        console.log("putResponse:", putResponse);
        setLoading(false);

        /*
        if(in_file){
            //list method can be used to check what's in the bucket. only lists public/ level items. useful for debug.
            //Storage.list('').then((res) => {
            //    console.log("s3 obj list:" , res);
            //}).catch((err) => {
            //    console.log("s3 obj list ERROR:", + err);
            //})


            //console.log('file name: ', searchResponse.fileName);
            putResponse = await put(tid, tName, tLoc);
            console.log("put response:", putResponse);
            //setLoading(false);
        
            console.log("status code:", putResponse.status);
            if (putResponse.status && putResponse.status == 200) { //add if status 200 to post file afterwards. also do this for POST method
                onChange();
                setLoading(false);
            }
            
            
        }
        else {
            putResponse = await put(tid, tName, tLoc);
            console.log('response: ', putResponse);
            setLoading(false);
        }
        */
                
    }


    async function handleImageAsFile(e){
        //console.log("e:",e);
        //image var holds the file object which has a type property 
        const image = e.target.files[0];          
        //console.log("image type:",image.type); // this will output the mime, i.e "image/png" or "image/jpg"
        setIn_file(image);
        //console.log('file:',in_file);   
     }

    //change name to something more meaningful, like in post page.
    /*
    async function onChange() {      
        //console.log("given file:", in_file); //debuging  
        
        let fileType = in_file.type

        //console.log("given file type:", fileType); //debuging  
        
        if (fileType.substring(0, 5) != "image" && fileType.substring(0, 5) != "video") {
            //console.log("Error: Input files must be of type image or video.");
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
    async function put(id, tname, loc){
        //console.log("inside button PUT trigger");
        let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/update";
        //also add a condition for file key and file later, like in the new post method
        if (!id || !tname|| !loc) {
            //console.log("PUT parameters incomplete. Canceling post.");
            NotificationManager.warning("PUT parameters incomplete. Canceling post.");
            return;
        }

        //NOTE: in the future, let partial updates without filling in all of the information.
        //this could be done similarly to how I set the coordinates below.
        let input_data = {
            'id': id,
            'tourName': tname,
            'location': loc,
            'fileName': 'tours/'+in_file.name
        };

        //for map markers
        var coordinates = getCoordinates();
        if (coordinates) {
            input_data['x-coordinate'] = coordinates.X;
            input_data['z-coordinate'] = coordinates.Z;
        }
        //console.log("input data:", input_data);
        //console.log("url: ", url);
                      
        let putRes = await fetch(url, 
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": userSession.idToken.jwtToken
                },
                body: JSON.stringify(input_data)
            })
            .then((response) => response.json().then((data) => {
                //console.log("response:", response);
                //console.log("data:", data);
                NotificationManager.success(data.message);
                //document.getElementById("put_res").innerHTML = data.message;
                data.status = response.status;
                return data; //returning data and response status code to putRes
            }))
            .catch((error) => {
                console.log("error:", error);
                NotificationManager.error("Error updating tour.");
                return error; //error already has a status code
            })
        return putRes; //returning putRes
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


    return(
        <Container>
            <h1>Update Page</h1>
            <Card bg="dark" className="text-center">
                <Card.Body>   
                    <Form>
                    <Form.Group controlId="formGroupId" >
                            <Row className="d-flex align-items-center">
                                <Col md="4">
                                    <Form.Label className="form-label"><h3>ID:</h3></Form.Label>
                                </Col>
                                <Col md="6">
                                    <Form.Control className="form-input"
                                        type="text"
                                        placeHolder="Enter tour's ID"
                                        value={tid}
                                        onChange={(e) => setTid(e.target.value)}   
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
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
                    <Button className="my-3" color="primary" loading={loading} onClick={()=> sendCall()} style={{width:"25%"}}>Update</Button>
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
export default Put;