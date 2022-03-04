import React, { useState, useRef, useCallback } from "react";
import Title from "./Title";
import "./Result.css";
import expand from "../img/expand.svg";
import edit from "../img/edit.svg";
import reject from "../img/reject.svg";
import tick from "../img/tick-gray.svg";
import close from "../img/close.svg";
import download from "../img/download.svg";
import { DotLoader } from "react-spinners";
import Modal from "react-modal";
import { saveAs } from "file-saver";
import JSZipUtils from "jszip-utils";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function Result(props) {
  const [expanded, setExpanded] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const handleReject = (idx) => {
    console.log(idx);
    props.setShortlisted((prev) => prev.filter((item, index) => index !== idx));
    props.setPotential((prev) => [...prev, props.shortlisted[idx]]);
  };

  const handleAccept = (idx) => {
    props.setPotential((prev) => prev.filter((item, index) => index !== idx));
    props.setShortlisted((prev) => [...prev, props.potential[idx]]);
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const handleEdit = (photo, index, category) => {
    setCropping({ photo, index, category });
  };

  const handleSave = (index, category) => {
    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    canvas.toBlob(
      function (blob) {
        var url = URL.createObjectURL(blob);
        if (category === "shortlisted") {
          let temp = props.shortlisted.slice();
          temp[index] = url;
          props.setShortlisted(temp);
        } else if (category === "potential") {
          let temp = props.potential.slice();
          temp[index] = url;
          props.setPotential(temp);
        }
      },
      "image/jpeg",
      1
    );

    handleCancel();
  };

  const handleCancel = () => {
    setCropping(false);
    setCrop({
      unit: "%",
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    });
  };

  const handleExpand = (photo) => {
    setExpanded(photo);
  };

  const handleDownload = (photos) => {
    console.log(photos);
    const zip = require("jszip")();
    let count = 0;
    photos.forEach((photo, index) => {
      const fileName = `${index}.jpeg`;
      JSZipUtils.getBinaryContent(photo, function (err, data) {
        zip.file(fileName, data, { binary: true });
        count++;
        if (count === photos.length) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "auto-curation-photos.zip");
          });
        }
      });
    });
  };

  return (
    <div id="result">
      {props.processing ? (
        <div className="loader">
          <DotLoader color="#40D3ED" size={100} loading={props.processing} />
        </div>
      ) : null}

      <Title sectionTitle="Results" line={true} />

      <div className="statistics">
        <div className="stat">
          <h3>{props.statistics.framesAnalysed}</h3>
          <p>
            Frames
            <br />
            Analysed
          </p>
        </div>
        <div className="stat">
          <h3>{props.statistics.framesSelected}</h3>
          <p>
            Frames
            <br />
            Selected
          </p>
        </div>
        <div className="stat">
          <h3>{props.statistics.invertebratesDetected}</h3>
          <p>
            Invertebrates
            <br />
            Detected
          </p>
        </div>
      </div>

      <div className="shortlisted">
        <Title sectionTitle="Short-listed Candidates" line={false} />

        <Modal
          isOpen={expanded !== false}
          onRequestClose={() => setExpanded(false)}
          className="expandModal"
          overlayClassName="paramsModalOverlay"
        >
          <img src={expanded} alt="expand" className="expandPhoto" />
          <div className="expandTools">
            <a href={expanded} download="auto-curation-result.jpeg">
              <img src={download} alt="download icon" className="expandTool" />
            </a>
            <img
              src={close}
              alt="close icon"
              className="expandTool"
              onClick={() => setExpanded(false)}
            />
          </div>
        </Modal>

        <Modal
          isOpen={cropping !== false}
          onRequestClose={handleCancel}
          className="cropModal"
          overlayClassName="paramsModalOverlay"
        >
          <div className="cropModalChild">
            <ReactCrop
              src={cropping.photo}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            />
            <div>
              <button
                className="primaryButton"
                onClick={() => handleSave(cropping.index, cropping.category)}
              >
                Save
              </button>
              <button className="secondaryButton" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        <div className="photoList">
          {props.shortlisted.map((p, index) => (
            <div className="photo" key={index}>
              <img src={p} alt="shortlisted" className="photoSrc" />
              <div className="photoTools">
                <img
                  src={expand}
                  alt="expand icon"
                  className="tools"
                  onClick={() => handleExpand(p)}
                />
                <img
                  src={edit}
                  alt="edit icon"
                  className="tools"
                  onClick={(e) => handleEdit(p, index, "shortlisted")}
                />
                <img
                  src={reject}
                  alt="reject icon"
                  className="tools"
                  onClick={() => handleReject(index)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="download">
          <button
            className="primaryButton"
            onClick={() => handleDownload(props.shortlisted)}
          >
            Download
          </button>
        </div>
      </div>

      <div className="potential">
        <Title sectionTitle="Potential Candidates" line={false} />
        <div className="photoList">
          {props.potential.map((p, index) => (
            <div className="photo" key={index}>
              <img src={p} alt="shortlisted" className="photoSrc" />
              <div className="photoTools">
                <img
                  src={expand}
                  alt="expand icon"
                  className="tools"
                  onClick={() => handleExpand(p)}
                />
                <img
                  src={edit}
                  alt="edit icon"
                  className="tools"
                  onClick={(e) => handleEdit(p, index, "potential")}
                />
                <img
                  src={tick}
                  alt="accept icon"
                  className="tools"
                  onClick={() => handleAccept(index)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="download">
          <button
            className="primaryButton"
            onClick={() => handleDownload(props.potential)}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
