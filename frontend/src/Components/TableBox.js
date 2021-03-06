import React from "react";
import { BeatLoader } from "react-spinners";

function TableBox(props) {
  const handleSelection = (e, video) => {
    if (e.target.checked) {
      if (video.startTime === undefined) {
        video.startTime = "00:00";
      }
      props.setSelections((prev) => [...prev, video]);
    } else {
      props.setSelections((prev) =>
        prev.filter((selection) => selection.name !== video.name)
      );
    }
  };

  const handleStartTime = (e, video) => {
    e.target.id = "changingTime";
    if (e.target.value.length === 5) {
      const splitedTime = e.target.value.split(":");
      if (
        !isNaN(parseInt(splitedTime[0])) &&
        parseInt(splitedTime[1]) < 60 &&
        e.target.value[2] === ":" &&
        parseInt(splitedTime[0]) <= parseInt(video.endTime.split(":")[0]) &&
        parseInt(splitedTime[1]) < parseInt(video.endTime.split(":")[1])
      ) {
        e.target.id = "";
        video.startTime = e.target.value;
        for (var selection of props.selections) {
          if (selection.name === video.name) {
            props.setSelections((prev) => [
              ...prev.filter((selection) => selection.name !== video.name),
              video,
            ]);
            break;
          }
        }
      } else {
        alert(`Invalid start time format (MM:SS) for ${video.name}`);
        e.target.value = "00:00";
        e.target.id = "";
      }
    }
  };

  const handleEndTime = (e, video) => {
    e.target.id = "changingTime";
    if (e.target.value.length === 5) {
      const splitedTime = e.target.value.split(":");
      if (
        !isNaN(parseInt(splitedTime[0])) &&
        parseInt(splitedTime[1]) < 60 &&
        e.target.value[2] === ":"
      ) {
        e.target.id = "";
        video.endTime = e.target.value;
        for (var selection of props.selections) {
          if (selection.name === video.name) {
            props.setSelections((prev) => [
              ...prev.filter((selection) => selection.name !== video.name),
              video,
            ]);
            break;
          }
        }
      } else {
        alert(`Invalid end time format (MM:SS) for ${video.name}`);
        e.target.value = video.endTime;
        e.target.id = "";
      }
    }
  };

  const renderContent = (video) => {
    const url = URL.createObjectURL(video.object);
    return (
      <div className="tableRow" key={video.name}>
        <div className="tableLeft">
          <input
            type="checkbox"
            className="checkBox"
            onClick={(e) => handleSelection(e, video)}
          />
          <video>
            <source src={url} type={video.type}></source>
          </video>
          <span className="fileName">{video.name}</span>
        </div>
        <div>
          <span className="fileType">{video.type}</span>
          <span className="fileSize">
            {(video.size / 1000000).toFixed(2)}MB
          </span>
          <span className="startTime">
            <input
              type="text"
              className="startValue"
              defaultValue="00:00"
              maxLength={5}
              onChange={(e) => handleStartTime(e, video)}
            />
          </span>
          <span className="endTime">
            <input
              type="text"
              className="endValue"
              defaultValue={video.endTime}
              maxLength={5}
              onChange={(e) => handleEndTime(e, video)}
            />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="tableBox">
      {props.loading ? (
        <div className="loader">
          <BeatLoader color="#40D3ED" size={24} loading={props.loading} />
        </div>
      ) : null}

      <div className="header">
        <div className="tableLeft">
          <input
            type="checkbox"
            className="checkBox"
            style={{ visibility: "hidden" }}
          />
          <span className="fileName">Name</span>
        </div>
        <div>
          <span className="fileType">Type</span>
          <span className="fileSize">Size</span>
          <span className="startTime">Start Time</span>
          <span className="endTime">End Time</span>
        </div>
      </div>

      {props.videos.map((video) => {
        if (
          (String(video.type).split("/")[1] === props.filterBy ||
            props.filterBy === "All Files") &&
          String(video.name).includes(props.searchBy)
        ) {
          return renderContent(video);
        } else if (props.filterBy === "All Files" && props.searchBy === "") {
          return renderContent(video);
        }
      })}
    </div>
  );
}

export default TableBox;
