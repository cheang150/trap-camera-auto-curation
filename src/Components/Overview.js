import React from 'react'
import './Overview.css'
import nature from '../img/nature.svg'
import Title from './Title'

function Overview() {
    return (
        <div id="overview">
            <Title sectionTitle="Overview" line={false}/>
            <div className="box">
                <h1>Camera Auto Curation</h1>
                <p id="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                <a href="https://github.com/" target="_blank" className="primaryButton" rel="noreferrer">Source Code</a>
                <img src={nature} alt="nature illustration"/>
            </div>
        </div>
    )
}

export default Overview
