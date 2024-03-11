import * as React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';
//React Bootstrap for grid layout
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function HomeLog() {
    
    return(
        <Container className="justify-content-center align-items-center text-center">
            <Row className="mb-5">
                <Col className="text-center">
                    <h1>Dashboard</h1>
                </Col>
            </Row>
            <Row className="mb-5">
                <Col>
                    <Link to="/homeLog/search">
                        <Container className="d-flex justify-content-center" >
                            <Image className="nav-image" 
                                src={require('./../../assets/images/searchLogo.jpg')}
                                alt="Open"/>
                        </Container>
                            Search
                    </Link>
                </Col>
                <Col >
                    <Link to="/homeLog/post">
                    <Container className="d-flex justify-content-center">
                        <Image className="nav-image" 
                            src={require('./../../assets/images/upload.JPG')}
                            alt="Open"/>
                        </Container>
                            Post
                    </Link>
                </Col>
            </Row>
            <Row className="mb-5">
                <Col>
                    <Link to="/homeLog/delete">
                    <Container className="d-flex justify-content-center">
                        <Image className="nav-image" 
                            src={require('./../../assets/images/delete.JPG')}
                            alt="Open"/>
                        </Container>              
                            Delete
                    </Link>
                </Col>
                <Col>
                    <Link to="/homeLog/put">
                    <Container className="d-flex justify-content-center container-center">
                        <Image className="nav-image"
                            src={require('./../../assets/images/replace.JPG')}
                            alt="Open"/>
                        </Container>
                            Replace
                    </Link>
                </Col>
            </Row>
        </Container>
    )
}

export default HomeLog;