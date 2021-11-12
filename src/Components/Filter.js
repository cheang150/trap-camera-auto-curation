import React from 'react'
import './Filter.css'

function Filter() {
    return (
        <div className="filter">
            <span>Filter by</span>
            <select className="filterList">
                <option value="all files">All Files</option>
                <option value="avi">AVI</option>
                <option value="mov">MOV</option>
                <option value="mp4">MP4</option>
            </select>
        </div>
    )
}

export default Filter
