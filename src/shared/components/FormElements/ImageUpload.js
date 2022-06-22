import React, { useRef } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = (props) => {
  const filePickerRef = useRef(); // We're using useRef here to store value that survive rerender cycle and extablishes a connection to a DOM element

  const pickedHandler = (event) => {
    console.log(event.target);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click(); // This method exists on this DOM node and it will open up the file picker, thereby allowing us to utilize the input element without seeing it because we initially set the display to none
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg, .png, .jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          <img src="" alt="Preview" />
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
