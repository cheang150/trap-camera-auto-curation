import React from "react";
import "./Filter.css";

function Filter(props) {
  return (
    <div className="filter">
      <span>Filter by</span>
      <select className="filterList" onChange={props.handleFilter}>
        <option value="All Files">All Files</option>
        {props.filterList.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;
