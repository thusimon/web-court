import { useState, MouseEvent } from "react";

import './image-feature.scss';
export interface ImageFeatureProps {
  imgUri: string;
};

const ImageFeature = ({imgUri}: ImageFeatureProps) => {
  const [hover, setHover] = useState(false);
  
  const onMouseEnterHandler = (evt: MouseEvent) => {
    setHover(true);
  }

  const onMouseLeaveHandler = (evt: MouseEvent) => {
    setHover(false);
  }

  return <div className='image-container' onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
    <span className={hover ? 'show-border' : 'hide-border'}>Image</span>
    <img src={imgUri} className={`${hover ? 'show' : 'hide'} modal-img`}></img>
  </div>
}

export default ImageFeature;
