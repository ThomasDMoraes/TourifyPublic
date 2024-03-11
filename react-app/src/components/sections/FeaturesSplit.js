import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';

const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const FeaturesSplit = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {

  const outerClasses = classNames(
    'features-split section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
    invertDesktop && 'invert-desktop',
    alignTop && 'align-top'
  );

  const sectionHeader = {
    title: 'About Us',
    paragraph: 'We are Group 23. We are students in the Engineering design 2 class that grouped together through our common interests and decided that a project relating to VR using unity would be the best project for us.'
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={splitClasses}>

          <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Team Lead & Unity Developer
                  </div>
                <h3 className="mt-0 mb-12">
                  Alexandro Galvez-Vega
                  </h3>            
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom'                
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/alex.JPG')}
                  alt="Features split 02"
                  width={528}
                  height={396} />
              </div>
            </div>
      
            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Unity developer
                  </div>
                <h3 className="mt-0 mb-12">
                  Gamalie Dulcio Haldas
                  </h3>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/gamalie.JPG')}
                  alt="Features split 03"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Unity developer
                  </div>
                <h3 className="mt-0 mb-12">
                  Aaron Mills
                  </h3>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/aaron.JPG')}
                  alt="Features split 03"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Front-end Developer
                  </div>
                <h3 className="mt-0 mb-12">
                  Micaela Sebastian
                  </h3>
                
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom'                  
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/micaela.JPG')}
                  alt="Features split 01"
                  width={300}
                  height={300} />
              </div>
            </div>            

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Full Stack Developer & AWS Specialist
                  </div>
                <h3 className="mt-0 mb-12">
                  Thomas Moraes
                  </h3>            
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom'                
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/thomas.JPG')}
                  alt="Features split 02"
                  width={528}
                  height={396} />
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </section>
  );
}

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;