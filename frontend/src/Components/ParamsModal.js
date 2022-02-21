import React, { useState } from "react";
import Modal from "react-modal";
import "./ParamsModal.css";
import settingsIcon from "../img/settings.svg";

Modal.setAppElement("#root");
function ParamsModal(props) {
  const [modalOpen, setModelOpen] = useState(false);
  const [resolutionModel, setResolutionModel] = useState(1);
  const [histogramEq, setHistogramEq] = useState(1);
  const [autoEnhance, setAutoEnhance] = useState(1);

  const handleOpen = () => {
    setModelOpen(true);
  };

  // Link to python and set shortlisted and potentail here
  const handleSave = () => {
    setModelOpen(false);
    props.setProcessing(true);
    for (let selection of props.selections) {
      alert(`Processing ${selection.name}, check console for more`);
      console.log(
        `Parameters: ${resolutionModel} ${histogramEq} ${autoEnhance}`
      );
      console.log("Processing", selection);
      props.setProcessedVideos((prev) => [...prev, selection.name]);
      props.setVideos((prev) =>
        prev.filter((video) => video.name !== selection.name)
      );
      props.setSelections((prev) =>
        prev.filter((video) => video.name !== selection.name)
      );
    }
    props.setProcessing(false);
  };

  const handleCancel = () => {
    setModelOpen(false);
  };

  const handleResolutionModel = (e) => {
    if (e.target.innerHTML === "ESPCN") {
      setResolutionModel(1);
    } else if (e.target.innerHTML === "FSRCNN") {
      setResolutionModel(2);
    } else if (e.target.innerHTML === "LapSRN") {
      setResolutionModel(3);
    }
  };

  const handleHistogramEq = (e) => {
    e.target.innerHTML === "On" ? setHistogramEq(1) : setHistogramEq(0);
  };

  const handleAutoEnhance = (e) => {
    e.target.innerHTML === "On" ? setAutoEnhance(1) : setAutoEnhance(0);
  };

  return (
    <div>
      <div id="processButton">
        <button
          className="primaryButton"
          disabled={props.loading || !props.selections.length}
          onClick={handleOpen}
        >
          Process
        </button>
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={handleCancel}
        className="paramsModal"
        overlayClassName="paramsModalOverlay"
      >
        <div className="modalChild">
          <img
            src={settingsIcon}
            alt="settings icon"
            className="settingsIcon"
          />

          <div className="params">
            <div className="data">
              <h3>Parameters Configuration</h3>
              <p>You can customize the configuration by changing it below.</p>
            </div>
            <div className="data">
              <h3>Super-resolution Model</h3>
              <p>Lorem Ipsum is simply dummy text of the printing.</p>
              <div className="buttonGrp">
                <button
                  id={resolutionModel === 1 ? "resModelButton" : null}
                  onClick={handleResolutionModel}
                >
                  ESPCN
                </button>
                <button
                  id={resolutionModel === 2 ? "resModelButton" : null}
                  onClick={handleResolutionModel}
                >
                  FSRCNN
                </button>
                <button
                  id={resolutionModel === 3 ? "resModelButton" : null}
                  onClick={handleResolutionModel}
                >
                  LapSRN
                </button>
              </div>
            </div>

            <div className="paramsLine"></div>

            <div className="data">
              <h3>Histogram Equalizer</h3>
              <p>Adjust image's contrast based on tonal distribution.</p>
              <div className="buttonGrp">
                <button
                  id={histogramEq === 1 ? "histEqButton" : null}
                  onClick={handleHistogramEq}
                >
                  On
                </button>
                <button
                  id={histogramEq === 0 ? "histEqButton" : null}
                  onClick={handleHistogramEq}
                >
                  Off
                </button>
              </div>
            </div>

            <div className="data">
              <h3>Auto Enhancement</h3>
              <p>Sharpen image using convolution kernal matrix.</p>
              <div className="buttonGrp">
                <button
                  id={autoEnhance === 1 ? "enhanceButton" : null}
                  onClick={handleAutoEnhance}
                >
                  On
                </button>
                <button
                  id={autoEnhance === 0 ? "enhanceButton" : null}
                  onClick={handleAutoEnhance}
                >
                  Off
                </button>
              </div>
            </div>

            <button className="primaryButton" onClick={handleSave}>
              Save
            </button>
            <button className="secondaryButton" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ParamsModal;
