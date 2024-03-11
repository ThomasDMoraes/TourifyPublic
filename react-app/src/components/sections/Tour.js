import React, { useState, useContext } from 'react';
import {Redirect} from "react-router-dom";
import { TourScriptsContext } from './TourScripts';
//React Bootstrap for grid layout
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from '../elements/Modal';


import NotificationManager from 'react-notifications/lib/NotificationManager';

const Tour = (props) => {
    const [show, setShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [updateClicked, setUpdateClicked] = useState(false);
    const {deleteByTourId} = useContext(TourScriptsContext);

    const handleModalShow = () => {
        setModalShow(true);   
    }

    const handleModalClose = () => {
        setModalShow(false);
    }

    const deleteConfirm = async () => {
        let res = await deleteByTourId(props.tour.id);
        setDeleted(res);
        handleModalClose();
    }

    const redirectUpdate = () => {
        if (deleted) {
            NotificationManager.error("Cannot update deleted tour.");
        }
        else {
            //navigate with id...
            NotificationManager.info("Redirecting to update page...");
            setUpdateClicked(true);
        }
    }

    return (
        <>
        <OverlayTrigger 
            placement="right"
            show={show}
            overlay={
                <Tooltip onMouseOverCapture={() => {setShow(true)}} onMouseLeave={() => {setTimeout(() => setShow(false), 1000)}}>
                    <Container>
                        {/*SHOULD LATER CHECK IF YOU CREATED IT, UNLESS YOU'RE ADMIN */}
                        <Button className="m-2" variant="warning" onClick={()=> {redirectUpdate()}} style={{width:"100%"}}>Update</Button> {/*leads to update page selected ID */}
                        {updateClicked && <Redirect push to={{pathname:"/homelog/put", state:{tour: props.tour}}}></Redirect>}
                        <Button className="m-2" variant="danger" onClick={()=> {handleModalShow()}} style={{width:"100%"}}>Delete</Button> {/*asks for confirmation and deletes */}
                    </Container>                    
                </Tooltip>}
        >
            <Row className={"my-4 p-2 d-flex align-items-center tour-item " + (deleted ? "text-danger text-decoration-line-through" : "")}  onMouseLeave={() => {setTimeout(() => setShow(false), 1000)}} onClick={() => setShow(!show)} >
                <Col md="3">
                    <Image src={props.tour.url} />
                </Col>
                <Col md="3">
                    <span>{props.tour.tourName}</span>
                </Col>
                <Col md="3">
                    <span>{props.tour.location}</span>
                </Col>
                <Col md="3">
                    <span>{props.tour.id}</span>
                </Col>
            </Row>    
        </OverlayTrigger>

        {/* Modal pop-up for delete confirmation */}
        <Modal show={modalShow}>
            <Container>
                <Row className="text-center">
                    <Col>
                        <h2>Confirmation</h2>
                    </Col>        
                </Row>
                <Row>
                    <Col>
                        <p>Are you sure you want to DELETE this tour?</p>
                    </Col>          
                </Row>
                <Row className="text-center">
                    <Col>
                        <Button className="m-2" variant="secondary" onClick={()=> {handleModalClose()}} style={{width:"80%"}}>Cancel</Button>
                    </Col>
                    <Col>
                        <Button className="m-2" variant="danger" onClick={()=> {deleteConfirm()}} style={{width:"80%"}}>Delete</Button>
                    </Col>
                </Row>
            </Container>
        </Modal>  
        </>
    )
}

export default Tour;