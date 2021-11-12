import React, { useState } from "react";
import Title from "./Title";
import Filter from "./Filter";
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

function Result(props) {
  const [expanded, setExpanded] = useState(false);

  const handleReject = (idx) => {
    console.log(idx);
    props.setShortlisted((prev) => prev.filter((item, index) => index !== idx));
    props.setPotential((prev) => [...prev, props.shortlisted[idx]]);
  };

  const handleAccept = (idx) => {
    props.setPotential((prev) => prev.filter((item, index) => index !== idx));
    props.setShortlisted((prev) => [...prev, props.potential[idx]]);
  };

  const handleExpand = (photo) => {
    console.log("expand");
    setExpanded(photo);
  };

  const handleDownload = (photos) => {
    const zip = require("jszip")();
    let count = 0;
    photos.forEach((photo, index) => {
      const fileName = photo
        .replace(/[\/]/gi, "")
        .replace("trap-camera-auto-curationstaticmedia", "");

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
      {/* {props.processing ? (
        <div className="loader">
          <DotLoader color="#40D3ED" size={100} loading={props.processing} />
        </div>
      ) : null} */}

      <Title sectionTitle="Results" line={true} />
      <div className="resultFilter">
        <Filter />
      </div>

      <div className="statistics">
        <div className="stat">
          <h3>54000</h3>
          <p>
            Frames
            <br />
            Analysed
          </p>
        </div>
        <div className="stat">
          <h3>351</h3>
          <p>
            Frames
            <br />
            Selected
          </p>
        </div>
        <div className="stat">
          <h3>182</h3>
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
          isOpen={expanded}
          onRequestClose={() => setExpanded(false)}
          className="expandModal"
          overlayClassName="paramsModalOverlay"
        >
          <img src={expanded} alt="expand" className="expandPhoto" />
          <div className="expandTools">
            <a href={expanded} download>
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
                <img src={edit} alt="edit icon" className="tools" />
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
                <img src={edit} alt="edit icon" className="tools" />
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
