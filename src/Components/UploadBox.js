import React, { useRef, useEffect } from "react";
import uploadIllustration from "../img/upload.svg";

function UploadBox(props) {
  const dropRef = useRef(null);

  useEffect(() => {
    const div = dropRef.current;
    div.addEventListener("dragover", props.handleDrag);
    div.addEventListener("drop", props.handleDrop);

    return () => {
      div.removeEventListener("dragover", props.handleDrag);
      div.removeEventListener("drop", props.handleDrop);
    };
  });

  return (
    <div className="uploadBox" ref={dropRef}>
      <img src={uploadIllustration} alt="upload illustration" />
      <p className="uploadDesc">
        Drop your files here, or{" "}
        <span onClick={() => props.uploadRef.current.click()}>browse</span>
      </p>
      <p className="uploadType">Supports AVI, MOV, MP4</p>
    </div>
  );
}

export default UploadBox;
