import * as React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';


function Home() {
    
    return(
        <div className="container">
            <h1>Home Page</h1>
            <Link to="/search">
                <Image
                    src={require('./../../assets/images/searchLogo.jpg')}
                    alt="Open"
                    width={70}
                    height={70} />Search
            </Link>
            <h1> </h1>
            <Link to="/post">
                <Image
                    src={require('./../../assets/images/upload.JPG')}
                    alt="Open"
                    width={70}
                    height={70} />Post
            </Link>
            <h1> </h1>
            <Link to="/delete">
                <Image
                    src={require('./../../assets/images/delete.JPG')}
                    alt="Open"
                    width={70}
                    height={70} />Delete
            </Link>
            <h1> </h1>
            <Link to="/put">
                <Image
                    src={require('./../../assets/images/replace.JPG')}
                    alt="Open"
                    width={70}
                    height={70} />Replace
            </Link>
        </div>
    )
}

export default Home;