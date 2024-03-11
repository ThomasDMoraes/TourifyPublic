import React, {useState, useContext} from "react";
import { AccountContext } from "./Account";

//React Bootstrap imports
import Button from '../elements/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
//notification pop-up messages
import {NotificationManager} from 'react-notifications';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const {authenticate} = useContext(AccountContext);

    const onSubmit = (event) => {
        setLoading(true);
        event.preventDefault();

        authenticate(email, password)
        .then(data => {
            console.log("Logged in!", data);
            NotificationManager.success("Successfully logged in!");
            window.location.href = '/homeLog'
        })
        .catch(err => {            
            // window.alert("Incorrect login information")
            NotificationManager.error(err.message);
            console.error("Failed to login", err);
        })
        .finally(() => {
            setLoading(false);
        })

    };

    return (
        <Container className="container-sm" data-reveal-delay="200">
            <Row> 
                <Card md="4" bg="dark" className="align-items-center text-center">
                    <Col md="9">
                        <Card.Header>
                            <Card.Title><h1 className="mt-0 reveal-from-bottom">Login Page</h1></Card.Title>
                        </Card.Header>
                        <Card.Body >
                            <Form onSubmit={onSubmit}>
                                <Form.Group controlId="formGroupEmail">
                                    <Form.Label className="form-label"><h5>Email:</h5></Form.Label>
                                    <Form.Control className="form-input"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formGroupPassword">
                                    <Form.Label><h5>Password:</h5></Form.Label>
                                    <Form.Control className="form-input"
                                        type="password" 
                                        placeholder="Password" 
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}>
                                    </Form.Control>                          
                                </Form.Group>
                                <Button className="my-5" type="submit" color="primary" loading={loading} style={{width:"40%"}}>Login</Button>
                            </Form>
                        </Card.Body>
                    </Col>
                </Card>
            </Row>

         {/*    Old component page (about the same, but without react bootstrap)
          <div className="container-sm" data-reveal-delay="200">
            <p> </p>
            <h1 className="mt-0 mb-16 reveal-from-bottom">Login Page</h1>
            <form onSubmit={onSubmit}>
                <p> </p>
                <label htmlFor="email">Email</label>
                <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                ></input>
                <label htmlFor="password"> Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                ></input>

                <button type="submit">Login</button>
            </form>
        </div>  */}
        </Container>
    );
};

export default Login;