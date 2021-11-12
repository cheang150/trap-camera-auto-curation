import React from "react";
import "./Search.css";
import searchIcon from "../img/search.svg";

function Search() {
  return (
    <div className="searchBar">
      <input type="text" placeholder="Search" />
      <button type="submit">
        <img src={searchIcon} alt="search icon" />
      </button>
    </div>
  );
}

export default Search;
