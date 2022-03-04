import React from "react";
import "./Overview.css";
import nature from "../img/nature.svg";
import Title from "./Title";

function Overview() {
  return (
    <div id="overview">
      <Title sectionTitle="Overview" line={false} />
      <div className="box">
        <h1>Camera Auto Curation</h1>
        <p id="description">
          This web application is implemented using React as frontend and
          Express to serve the backend. The backend consists of two major
          components, namely Background Subtraction for motion detection and
          MegaDetector for subject detection.
        </p>
        <a
          href="https://github.com/cheang150/trap-camera-auto-curation"
          target="_blank"
          className="primaryButton"
          rel="noreferrer"
        >
          Source Code
        </a>
        <img src={nature} alt="nature illustration" />
      </div>
    </div>
  );
}

export default Overview;
