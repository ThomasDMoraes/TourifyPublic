import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';
import {ReactComponent as Documentsvg} from './../../assets/images/document-svgrepo-com.svg';
import {ReactComponent as Tile1svg} from './../../assets/images/feature-tile-icon-01.svg';
import {ReactComponent as Tile2svg} from './../../assets/images/feature-tile-icon-02.svg';
import {ReactComponent as Tile3svg} from './../../assets/images/feature-tile-icon-03.svg';
import {ReactComponent as Tile4svg} from './../../assets/images/feature-tile-icon-04.svg';
import {ReactComponent as Tile5svg} from './../../assets/images/feature-tile-icon-05.svg';
import {ReactComponent as Tile6svg} from './../../assets/images/feature-tile-icon-06.svg';


const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}
const FeaturesTiles = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {

  const outerClasses = classNames(
    'features-tiles section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-tiles-inner section-inner pt-0',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap center-content',
    pushLeft && 'push-left'
  );

  const sectionHeader = {
    title: 'Key Features',
    paragraph: ''
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>

            <div className="tiles-item reveal-from-bottom">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Tile1svg height="64px" width="64px"/>
                  </div> 
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                  User-friendly web interface that facilitates file uploading for Administrators
                    </h4>
                  <p className="m-0 text-sm">
                    
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Tile2svg height="64px" width="64px"/>
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                  Easy-to-use VR app for prospective students to navigate college campuses 
                    </h4>
                  <p className="m-0 text-sm">
                    
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="400">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Tile3svg height="64px" width="64px"/>
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                  Convenient menu options to provide users with customizability and accommodations for personalized experiences 
                    </h4>
                  <p className="m-0 text-sm">
                    
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Tile4svg height="64px" width="64px"/>
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                  Voice Recognition to facilitate those not quite adept with VR tool
                    </h4>
                  <p className="m-0 text-sm">
                    
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Tile5svg height="64px" width="64px"/>
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                  Integration with AWS cloud services
                    </h4>
                  <p className="m-0 text-sm">
                    
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="400">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Tile6svg height="64px" width="64px"/>
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                  Data management capabilities   
                    </h4>
                  <p className="m-0 text-sm">
                    
                    </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

FeaturesTiles.propTypes = propTypes;
FeaturesTiles.defaultProps = defaultProps;

export default FeaturesTiles;