import React, { useRef, useEffect } from "react";
import { BeatLoader } from "react-spinners";

function TableBox(props) {
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
    <div className="tableBox" ref={dropRef}>
      {props.loading ? (
        <div className="loader">
          <BeatLoader color="#40D3ED" size={24} loading={props.loading} />
        </div>
      ) : null}

      <div className="header">
        <div className="tableLeft">
          <input type="checkbox" className="checkBox" />
          <span className="fileName">Name</span>
        </div>
        <div>
          <span className="fileType">Type</span>
          <span className="fileSize">Size</span>
          <span className="startTime">Start Time</span>
          <span className="endTime">End Time</span>
        </div>
      </div>

      {props.videos.map((video, index) => (
        <div className="tableRow" key={index}>
          <div className="tableLeft">
            <input type="checkbox" className="checkBox" />
            <video>
              <source src={video} type={props.types[index]}></source>
            </video>
            <span className="fileName">{props.names[index]}</span>
          </div>
          <div>
            <span className="fileType">{props.types[index]}</span>
            <span className="fileSize">
              {(props.sizes[index] / 1000000).toFixed(2)}MB
            </span>
            <span className="startTime">
              <input
                type="text"
                className="startValue"
                defaultValue="00:00"
                maxLength={5}
              />
            </span>
            <span className="endTime">
              <input
                type="text"
                className="endValue"
                defaultValue={props.endTime[index]}
                maxLength={5}
              />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TableBox;
