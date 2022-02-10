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
  const [names, setNames] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [types, setTypes] = useState([]);
  const [endTime, setEndTime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const [filterBy, setFilterBy] = useState("All Files");
  const [searchBy, setSearchBy] = useState("");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const type = String(e.dataTransfer.files[0].type).split("/")[1];
      if (!filterList.includes(type)) {
        setFilterList((prev) => [...prev, type]);
      }
      setLoading((prev) => !prev);
      setNames((prev) => [...prev, e.dataTransfer.files[0].name]);
      setSizes((prev) => [...prev, e.dataTransfer.files[0].size]);
      setTypes((prev) => [...prev, e.dataTransfer.files[0].type]);
      setVideos((prev) => [
        ...prev,
        URL.createObjectURL(e.dataTransfer.files[0]),
      ]);
      var reader = new FileReader();
      reader.onload = function () {
        var vid = new Audio(reader.result);
        vid.onloadedmetadata = function () {
          const convertedEndTime =
            ("0" + (Math.floor(parseInt(vid.duration) / 60) % 60)).slice(-2) +
            ":" +
            ("0" + (parseInt(vid.duration) % 60)).slice(-2);
          setEndTime((prev) => [...prev, convertedEndTime]);
          setLoading((prev) => !prev);
        };
      };
      reader.readAsDataURL(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const type = String(e.target.files[0].type).split("/")[1];
    if (!filterList.includes(type)) {
      setFilterList((prev) => [...prev, type]);
    }
    setLoading((prev) => !prev);
    setNames((prev) => [...prev, e.target.files[0].name]);
    setSizes((prev) => [...prev, e.target.files[0].size]);
    setTypes((prev) => [...prev, e.target.files[0].type]);
    setVideos((prev) => [...prev, URL.createObjectURL(e.target.files[0])]);
    var reader = new FileReader();
    reader.onload = function () {
      var vid = new Audio(reader.result);
      vid.onloadedmetadata = function () {
        const convertedEndTime =
          ("0" + (Math.floor(parseInt(vid.duration) / 60) % 60)).slice(-2) +
          ":" +
          ("0" + (parseInt(vid.duration) % 60)).slice(-2);
        setEndTime((prev) => [...prev, convertedEndTime]);
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
            multiple
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
        <UploadBox
          setNames={setNames}
          setTypes={setTypes}
          setSizes={setSizes}
          setEndTime={setEndTime}
          setVideos={setVideos}
          uploadRef={uploadRef}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
        />
      ) : (
        <React.Fragment>
          <TableBox
            videos={videos}
            names={names}
            sizes={sizes}
            types={types}
            endTime={endTime}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            loading={loading}
            filterBy={filterBy}
            searchBy={searchBy}
          />
          <ParamsModal
            videos={videos}
            setShortlisted={props.setShortlisted}
            setPotential={props.setPotential}
            setProcessing={props.setProcessing}
            loading={loading}
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default Upload;
