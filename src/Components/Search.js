import React from "react";
import "./Search.css";
import searchIcon from "../img/search.svg";

function Search(props) {
  return (
    <div className="searchBar">
      <input type="text" placeholder="Search" onChange={props.handleSearch} />
      <button type="submit">
        <img src={searchIcon} alt="search icon" />
      </button>
    </div>
  );
}

export default Search;
