import React, { useRef } from "react";
import uploadIllustration from "../img/upload.svg";
import { BeatLoader } from "react-spinners";

function UploadBox(props) {
  const dropRef = useRef(null);

  return (
      <div className="uploadBox" ref={dropRef}>
          {props.loading ? (
              <div className="loader">
                  <BeatLoader color="#40D3ED" size={24} loading={props.loading} />
              </div>
          ) : null}
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
