import React, { useState } from "react";
import Modal from "react-modal";
import "./ParamsModal.css";
import settingsIcon from "../img/settings.svg";

Modal.setAppElement("#root");
function ParamsModal(props) {
  const [modalOpen, setModelOpen] = useState(false);
  const [resolutionModel, setResolutionModel] = useState("ESPCN");
  const [histogramEq, setHistogramEq] = useState(true);
  const [autoEnhance, setAutoEnhance] = useState(true);

  const handleOpen = () => {
    setModelOpen(true);
  };

  // Link to python and set shortlisted and potentail here
  const handleSave = () => {
    setModelOpen(false);
    props.setProcessing(true);
    alert(
      `Processing ${props.videos.length} videos with ${resolutionModel} ${histogramEq} ${autoEnhance}`
    );
  };

  const handleCancel = () => {
    setModelOpen(false);
  };

  const handleResolutionModel = (e) => {
    setResolutionModel(e.target.innerHTML);
  };

  const handleHistogramEq = (e) => {
    e.target.innerHTML === "On" ? setHistogramEq(true) : setHistogramEq(false);
  };

  const handleAutoEnhance = (e) => {
    e.target.innerHTML === "On" ? setAutoEnhance(true) : setAutoEnhance(false);
  };

  return (
    <div>
      <div id="processButton">
        <button
          className="primaryButton"
          disabled={props.loading}
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
                  id={resolutionModel === "ESPCN" ? "resModelButton" : null}
                  onClick={handleResolutionModel}
                >
                  ESPCN
                </button>
                <button
                  id={resolutionModel === "FSRCNN" ? "resModelButton" : null}
                  onClick={handleResolutionModel}
                >
                  FSRCNN
                </button>
                <button
                  id={resolutionModel === "LapSRN" ? "resModelButton" : null}
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
                  id={histogramEq === true ? "histEqButton" : null}
                  onClick={handleHistogramEq}
                >
                  On
                </button>
                <button
                  id={histogramEq === false ? "histEqButton" : null}
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
                  id={autoEnhance === true ? "enhanceButton" : null}
                  onClick={handleAutoEnhance}
                >
                  On
                </button>
                <button
                  id={autoEnhance === false ? "enhanceButton" : null}
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
