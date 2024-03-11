import React, { useContext, useState } from 'react';
import ImageMarker, { Marker } from "react-image-marker";
import UserPool from "./UserPool";
import Tour from './Tour';
import { TourScriptsContext } from './TourScripts';
//React Bootstrap for grid layout
import Button from '../elements/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
//notification pop-up messages
import {NotificationManager} from 'react-notifications';


function Search() {
    const [showId, setShowId] = useState(false);
    //added use state hooks to keep track of user inputs
    const [tid, setTid] = useState("");
    const [tname, setTname] = useState("");
    const [loc, setLoc] = useState("");
    const [response, setResponse] = useState("");
    //for image map rendering tours as markers (tentative)
    const [markers, setMarkers] = useState([]);
    //loading indicator
    const [loading, setLoading] = useState(false);

    const {getByTourId, getByTourNameLoc} = useContext(TourScriptsContext); //importing functions instead for more reusability across the app. Commented out the old ones for now.

    //adding auth to call using user cognito tokens. Make userSession a global variable later so we don't have to use this everywhere.
    UserPool.getCurrentUser().getSession((err, session) => {
        if (err) {
            return err;
        }
        else {
            return session;
        }
    })
    //console.log("User Session:", userSession);

    //taken from App.js and modified
    //may be transfered to just a web page whenever someone clicks a tour id, showing more of the specific info and map.
    /*
    async function getByTourId(id) {
        console.log("Id =", id)
        console.log('Getting by tour ID...')
        if (!id) {
            NotificationManager.warning("ID field is empty. Try again.");
            return;
        }

        let res = await fetch("https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/id?id="+id, 
        {
            method: "GET",
            headers: {
                "Authorization": userSession.idToken.jwtToken
            }
        })
        .then((response) => response.json().then((tData) => {
            console.log("response:", response);
            console.log("data:", tData);

            if (tData.id) { //match found
                NotificationManager.success("Tour retrieved!");
            }
           else {
                window.alert(tData.message);
                NotificationManager.warning(tData.message);
           }
           setResponse(tData);
           return tData;
        }))
        .catch((err) => {
            console.log("unexpected error:", err);
            NotificationManager.error("Unexpected error. Try again.");
        }) 
        return res;               
      } 
      */

      /*
      async function getByTourNameLoc(tname, loc) {
        console.log("Tour name =", tname)
        console.log("Location =", loc)
        console.log('Getting by tour Name and location...')

        let res = await fetch("https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/search?tourName=" + tname + "&location=" + loc, 
        {
            //auth header
            method: "GET",
            headers: {
                "Authorization": userSession.idToken.jwtToken
            }
        })
        .then((response) => response.json().then((tData) => {
            console.log("response:", response);
            console.log("data:", tData);
            setResponse(tData); //used for mapping (new update)
            if (tData.length === 0) {
                 NotificationManager.warning("No matches found.");
            }
            else {
                NotificationManager.success("Tours retrieved!");
            }
            
            return tData;
        }))
        .catch((err) => {
            console.log("unexpected error:", err);
            NotificationManager.error("Unexpected error. Try again.");
        }) 
        return res;
    }
    */

    //added sendCall to be called when SEARCH button is clicked
    let sendCall = async () => {
        console.log("SEARCH button clicked!"); //debuging
        console.log("given tour id:", tid); //debuging
        console.log("given tour name:", tname); //debuging
        console.log("given tour location:", loc); //debuging
        console.log("showId:", showId);
        var getResponse;
        if (showId) {
            getResponse = await getByTourId(tid);
            //console.log("response:", getResponse);
            
        }
        else {
           getResponse = await getByTourNameLoc(tname, loc);
           //loading up response tours into the map
           
        }
        console.log("response:", getResponse);
        setResponse(getResponse);
        setAllMarkers(getResponse);
    }


    //map functions:
    //called on map element
    async function setAllMarkers(tourRecords) {
        //resetting markers
        markers.splice(0, markers.length); // (may be a more efficient way with just setMarker)
        setMarkers([]);
        console.log("Setting marker(s)");
        if (tourRecords[0]) {
            tourRecords.forEach((record) => {
                if (record.X && record.Z) {
                    //console.log("record:", record);
                    //console.log("markers(before):", markers);
                    markers.push({left : record.X, top : record.Z, tourId: record.tourId, tourName: record.tourName}); //adding the markers (may be a more efficient way with just setMarker)
                    setMarkers([...markers]); //rendering the markers
                }
            });
        }
        else {
            //console.log("markers(before):", markers);
            setMarkers([{left : tourRecords.X, top : tourRecords.Z, tourId: tourRecords.tourId, tourName: tourRecords.tourName}]);
        }
    }

    //declaring a custom marker as an improvement
    //should add some onHover change in display for the user experience.
    //hovering over should make it look selected, and pop up some text regarding the marker (tour info)
    //might need to synchronize markers with an array of retrieved tours for this.
    const CustomMarker = (props) => {
        return (
            <p 
            className="image-marker__marker image-marker__marker--default tour-marker" 
            style = {{
                color: "black",
                border: '2px solid black',
                fontSize: '12px'
            }}>
                {props.tourName}
            </p> 
        )
    }

    //a function used to Tab switching for now...
    const tabSwitch = (k) => {
        if (k === "idLookup") {
            setShowId(true);
        }
        else  {
            setShowId(false);
        }   
    }

    return(

    <Container>
        <h1>Search Page</h1>
            <Row>
                <Card bg="dark" className="text-center">
                    <Card.Body>
                        {/*navigation tabs (search or ID)*/}
                        <Tabs defaultActiveKey="search"
                            onSelect={(k) => {tabSwitch(k)}}
                        >
                            <Tab eventKey="search" title="Search">
                                {/* Title + location search form */} 
                                <Form>
                                    <Form.Group controlId="formGroupSearch" >
                                        <Row className="d-flex align-items-center">
                                            <Col md="4">
                                                <Form.Label className="form-label"><h3>Name:</h3></Form.Label>
                                            </Col>
                                            <Col md="6">
                                                <Form.Control className="form-input"
                                                    type="text"
                                                    placeHolder="Enter tour's name"
                                                    value={tname}
                                                    onChange={(e) => setTname(e.target.value)}   
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group controlId="formGroupSearch">
                                        <Row className="d-flex align-items-center">
                                            <Col md="4">
                                                <Form.Label className="form-label"><h3>Location:</h3></Form.Label>
                                            </Col>
                                            <Col md="6">
                                                <Form.Control className="form-input"
                                                    type="text"
                                                    placeHolder="Enter tour's location"
                                                    value={loc}
                                                    onChange={(e) => setLoc(e.target.value)}       
                                            />
                                            </Col>
                                        </Row>
                                    </Form.Group> 
                                </Form>   
                            </Tab>
                            <Tab eventKey="idLookup" title="ID Lookup">
                                {/* ID search form */} 
                                <Form>
                                    <Form.Group controlId="formGroupId" className="d-flex align-items-center justify-content-center">
                                        <Form.Label className="form-label me-2"><h3>ID:</h3></Form.Label>
                                        <Form.Control className="form-input"
                                            type="text"
                                            placeHolder="Enter tour's ID"
                                            value={tid}
                                            onChange={(e) => setTid(e.target.value)}
                                            style={{width:"40%"}}
                                        />
                                    </Form.Group>                
                                </Form>   
                            </Tab>
                        </Tabs>
                        <Button className="my-3" color="primary" loading={loading} onClick={()=> sendCall()} style={{width:"25%"}}>Search</Button>
                    </Card.Body>
                </Card>
            </Row>

            {/*Item response for ID get (deciding later if we keep this or not...)*/}
            {response && !Array.isArray(response) && 
            <Row className="my-5">
                <Card bg="dark">
                    <Card.Title className="text-center"><h2>Result</h2></Card.Title>
                    <Card.Body>
                        <Card.Text className="text-warning text-sm"><i>Note: Select a tour to update / delete</i></Card.Text>
                        <Tour tour = {response}></Tour>
                    </Card.Body>
 
                </Card>
            </Row>
            }

            {/*Table response for SEARCH get*/}
            {response && Array.isArray(response) &&  
                <Row className="my-5"> 
                    <Card bg="dark">
                        {/* Attributes header */}
                        <Card.Header>
                            <Row className="text-center"><Card.Title><h2>Results</h2></Card.Title></Row>
                            <Row className="my-4 p-2 d-flex align-items-center">
                                <Col md="3">
                                    <Card.Title>Image</Card.Title>
                                </Col>
                                <Col md="3">
                                    <Card.Title>Name</Card.Title>
                                </Col>
                                <Col md="3">
                                <Card.Title>Location</Card.Title>
                                </Col>
                                <Col md="3">
                                <Card.Title>ID</Card.Title>
                                </Col>
                            </Row>
                        </Card.Header>
                        {/* Results card with mapped array */}
                        <Card.Body>
                            <Card.Text className="text-warning text-sm"><i>Note: Select a tour to update / delete</i></Card.Text>
                            {response.map((tour) => {
                                return (
                                <Tour
                                    key = {tour.id}
                                    tour = {tour}
                                />)
                            })}
                        </Card.Body>
                    </Card>
                </Row>
            }
                {response &&
                    <Row className="my-5">
                        <Card bg="dark">
                            <Card.Title className="text-center"><h2>Results Map</h2></Card.Title>
                            <ImageMarker
                                src="https://tourify-tours.s3.amazonaws.com/public/maps/map.jpg"
                                markers={markers}
                                markerComponent={CustomMarker}
                            />
                        </Card>
                    </Row>
                }
    </Container>
    )
}

export default Search;
