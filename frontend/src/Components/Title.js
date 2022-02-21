import React from 'react'
import './Title.css'

function Title(props) {
    return (
        <div className="title">
            <h2>{props.sectionTitle}</h2>
            {props.line ? <div className="line"></div> : null}
        </div>
    )
}

export default Title
