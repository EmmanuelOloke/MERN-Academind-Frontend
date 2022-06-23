import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = (props) => {
  const [file, setFile] = useState(); // We use useState to manage the file states because we'll need to update the DOM after choosing a file, so we can later preview what has been chosen
  const [previewUrl, setPreviewUrl] = useState(); // The URL of the image preview we wanna generate so we can show the preview to the user
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef(); // We're using useRef here to store value that survive rerender cycle and extablishes a connection to a DOM element

  useEffect(() => {
    // We use useEffect to do something upon a state change. This function will execute whenever a file changes.
    if (!file) {
      return;
    }
    const fileReader = new FileReader(); // One we know we have a file, then we can generate an image preview URL, with the browser built-in API/Class FileReader(), it helps use read and parse files
    fileReader.onload = () => {
      // We execute this function whenever the file reader is done loading/parsing/reading a file
      setPreviewUrl(fileReader.result); // We don't get the parsed file as an argument, instead we have to extract it from fileReader.result. That's just how the API works
    };
    fileReader.readAsDataURL(file); // Command to create a URL we can output. It converts the file/binary data into a readable or outputable URL that we can now use
  }, [file]);

  const pickedHandler = (event) => {
    // The event.target object has a files property that holds the file that has been chosen. This is a default JS method
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
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
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
