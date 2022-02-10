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

  const renderContent = (video, index) => {
    return (
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
    );
  };

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

      {props.videos.map((video, index) => {
        console.log(props.searchBy);
        console.log(props.filterBy);

        if (String(props.types[index]).split("/")[1] === props.filterBy) {
          return renderContent(video, index);
        } else if (props.filterBy === "All Files" && props.searchBy === "") {
          return renderContent(video, index);
        } else if (String(props.names[index]).includes(props.searchBy)) {
          // console.log(props.names[index]);
          return renderContent(video, index);
        }
        // } else if (props.filterBy === "All Files") {
        //   // console.log("rendering all");
        //   return renderContent(video, index);
        // }
        // else if (String(props.types[index]).split("/")[1] === props.filterBy) {
        //   console.log(props.types[index]);
        //   return renderContent(video, index);
        // }
        // else if (props.filterBy === "All Files") {
        //   return tableContent(video, index);
        // }
      })}
    </div>
  );
}

export default TableBox;
