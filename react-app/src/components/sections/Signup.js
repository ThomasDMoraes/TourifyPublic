import React, {useState} from "react";
import UserPool from "./UserPool";
import { Link, Redirect, RouteComponentProps } from 'react-router-dom'
import {Auth} from 'aws-amplify';

//React Bootstrap imports
//import Button from './Button';
import Button from '../elements/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
//notification pop-up messages
import {NotificationManager} from 'react-notifications';


const Signup = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    let sendInfo = async () => {
        setLoading(true);
        UserPool.signUp(email, password, [], null, (err, data) =>{
            if (err) {
                //window.alert("Please enter an appropriate password");
                NotificationManager.error(err.message);
                console.error(err);
                setLoading(false);
            }
            else {
                //window.alert("Sign up successful! \nPlease check your email for the verification code and input the code below");
                NotificationManager.success("Sign up successful! \nPlease check your email for the verification code and input the code below");
                setLoading(false);       
            }
            console.log(data);
        });     
        
    };

    //may need to also resend tokens if needed...
    let sendCall = async () => {
        setLoading(true);
        console.log("Confirm button clicked!"); //debuging
        Auth.confirmSignUp(email, code)
        .then(() => {
            //window.alert('Succesfully confirmed! \nClick on Sign in');
            NotificationManager.success("Succesfully confirmed! You may now login.");
            setConfirmed(true);
        })
        .catch(err => {
            //window.alert('error', 'Invalid code', err.message);
            NotificationManager.error(err.message);    
        })
        .finally(() => {
            setLoading(false);
        }); 
    }


    return (
        <Container className="container-sm" data-reveal-delay="200">
            <Row> 
                <Card md="4" bg="dark" className="align-items-center text-center">
                    <Col md="9">
                        <Card.Header>
                            <Card.Title><h1 className="mt-0 reveal-from-bottom">Sign Up Page</h1></Card.Title>
                        </Card.Header>
                        <Card.Body >
                            <Form>
                                <Form.Group controlId="formGroupEmail">
                                    <Form.Label className="form-label"><h5>Email:</h5></Form.Label>
                                    <Form.Control className="form-input"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}>
                                    </Form.Control>
                                    <Form.Text>A verification code will be sent to this email.</Form.Text>
                                </Form.Group>
                                <Form.Group controlId="formGroupPassword">
                                    <Form.Label><h5>Password:</h5></Form.Label>
                                    <Form.Control className="form-input"
                                        type="password" 
                                        placeholder="Password" 
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}>
                                    </Form.Control>
                                    <Form.Text className="align-items-center">
                                        Passwords must contain at least:
                                        <ul className="border" style={{listStyle:"none"}}>
                                            <li style={{fontSize:"15px"}}>1 uppercase letter</li>  
                                            <li style={{fontSize:"15px"}}>1 lowercase letter</li>
                                            <li style={{fontSize:"15px"}}>1 number</li>
                                            <li style={{fontSize:"15px"}}>1 special character</li>
                                        </ul>
                                    </Form.Text>                       
                                </Form.Group>                                
                            </Form>
                            <Button className="my-5" color="primary" loading={loading} style={{width:"40%"}} onClick={() => sendInfo()}>Sign Up</Button>
                        </Card.Body>
                        <Card.Footer>
                            <h5>Confirmation:</h5>
                            <Form className="justify-content-center">
                                <Form.Label>
                                    Verification Code:
                                </Form.Label>
                                <div className="d-flex justify-content-center">
                                <Form.Control className="form-input" style={{width:"30%"}}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}>
                                </Form.Control></div>  
                            </Form>
                            <Button className="my-5" color="primary" loading={loading} style={{width:"40%"}} onClick={() => sendCall()}>Confirm</Button>
                        </Card.Footer>
                    </Col>
                </Card>
            </Row>
            {confirmed && <Redirect to="./login"></Redirect>}

        
        {/* <div className="container-sm" data-reveal-delay="200">
            <p> </p>
            <h1 className="mt-0 mb-16 reveal-from-bottom">Sign up Page</h1>
            
                <p> </p>
                <label htmlFor="email">Email</label>
                <input type='text' placeholder="Enter Email" 
                            value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <label htmlFor="password"> Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <Button text='Confirm' onClick= {()=> sendInfo()}/>
                <p> </p>
                <p>Password must contain: <br></br>1 uppercase letter <br></br>1 lowercase letter <br></br>1 number <br></br>1 special character</p>
                
                <h1> </h1>
                <label htmlFor="code">Verification Code</label>
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                ></input>
                <Button text='Confirm' onClick= {()=> sendCall()}/>
                <h1> </h1>
                <Link to="/login">Sign in</Link>
        </div> */}
        </Container>
    );
};

export default Signup;