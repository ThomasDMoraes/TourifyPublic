import React, { useContext, useState } from 'react';
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

function Delete() {    
    
    //added use state hooks to keep track of user inputs
    const [tid, setTid] = useState("");
    const [loading, setLoading] = useState(false);
    const {deleteByTourId} = useContext(TourScriptsContext);

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
        setLoading(true);
        console.log("Delete button clicked!"); //debuging
        console.log("given tour id:", tid); //debuging 
        await deleteByTourId(tid);    
        setLoading(false);
    }

    /*
    async function delByTourId(id) {
        console.log("inside button DELETE trigger");
        let url = "https://2d7tkc5pj2.execute-api.us-east-1.amazonaws.com/beta/tours/delete?id="+id;
        console.log("id: ", id);
        console.log("url: ", url);
        if (!id) {
            console.log("DELETE parameters incomplete. Canceling request.");
            NotificationManager.warning("DELETE parameters incomplete. Try again.");
            return;
        }
        
        fetch(url, 
            {
                method: 'DELETE',
                headers: {
                    "Authorization": userSession.idToken.jwtToken
                }
            })
            .then((response) => response.json().then((data) => {
                console.log("response:", response);
                console.log("data:", data);
                NotificationManager.info(data.message); //no matches also trigger this. Something to change on backend...
            }))
            .catch((error) => {
                console.log("error:", error);
                window.alert(error);
                NotificationManager.error(error);
            })
    }
    */
    
    return(
        <Container>
            <h1>Delete Page</h1>
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
                                        placeHolder="Enter tour's id"
                                        value={tid}
                                        onChange={(e) => setTid(e.target.value)}   
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                    <Button className="my-3" color="primary" loading={loading} onClick={()=> sendCall()} style={{width:"25%"}}>Delete</Button>
                </Card.Body>
            </Card>
        </Container>
    )
}
export default Delete;