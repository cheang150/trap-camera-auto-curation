import React, { useRef, useState } from "react";
import Filter from "./Filter";
import ParamsModal from "./ParamsModal";
import Search from "./Search";
import TableBox from "./TableBox";
import Title from "./Title";
import "./Upload.css";
import UploadBox from "./UploadBox";

function Upload(props) {
  const uploadRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const [filterBy, setFilterBy] = useState("All Files");
  const [searchBy, setSearchBy] = useState("");

  const handleUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const type = String(e.target.files[0].type).split("/")[1];
    if (!filterList.includes(type)) {
      setFilterList((prev) => [...prev, type]);
    }
    setLoading((prev) => !prev);
    const videoDatas = {
      object: e.target.files[0],
      name: e.target.files[0].name,
      size: e.target.files[0].size,
      type: e.target.files[0].type,
    };
    var reader = new FileReader();
    reader.onload = function () {
      var vid = new Audio(reader.result);
      vid.onloadedmetadata = function () {
        const convertedEndTime =
          ("0" + (Math.floor(parseInt(vid.duration) / 60) % 60)).slice(-2) +
          ":" +
          ("0" + (parseInt(vid.duration) % 60)).slice(-2);
        videoDatas.endTime = convertedEndTime;
        setVideos((prev) => [...prev, videoDatas]);
        setLoading((prev) => !prev);
      };
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleFilter = (e) => {
    setFilterBy(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchBy(e.target.value);
  };

  return (
    <div id="upload">
      <Title sectionTitle="Upload Files" line={true} />
      <div className="uploadTools">
        <Filter filterList={filterList} handleFilter={handleFilter} />
        <div className="rightTools">
          <Search handleSearch={handleSearch} />
          <input
            type="file"
            ref={uploadRef}
            style={{ display: "none" }}
            onChange={handleUpload}
          />
          <button
            type="submit"
            className="primaryButton"
            onClick={() => uploadRef.current.click()}
          >
            Upload
          </button>
        </div>
      </div>

      {videos.length === 0 ? (
        <UploadBox uploadRef={uploadRef} />
      ) : (
        <React.Fragment>
          <TableBox
            videos={videos}
            loading={loading}
            filterBy={filterBy}
            searchBy={searchBy}
            setSelections={props.setSelections}
            selections={props.selections}
          />
          <ParamsModal
            selections={props.selections}
            setSelections={props.setSelections}
            setShortlisted={props.setShortlisted}
            setPotential={props.setPotential}
            setProcessing={props.setProcessing}
            loading={loading}
            setProcessedVideos={props.setProcessedVideos}
            setVideos={setVideos}
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default Upload;
