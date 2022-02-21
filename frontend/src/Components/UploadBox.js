import React, { useRef } from "react";
import uploadIllustration from "../img/upload.svg";

function UploadBox(props) {
  const dropRef = useRef(null);

  return (
    <div className="uploadBox" ref={dropRef}>
      <img src={uploadIllustration} alt="upload illustration" />
      <p className="uploadDesc">
        <span onClick={() => props.uploadRef.current.click()}>Browse </span>
        your files here
      </p>
      <p className="uploadType">Supports AVI, MOV, MP4</p>
    </div>
  );
}

export default UploadBox;
