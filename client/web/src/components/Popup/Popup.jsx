import React from 'react';

import './Popup.css';

const Popup = ({ content, display, top, bottom, left, right }) => {
    return (
        <div className='popup' style={{display: !display ? "none" : "", top: top, bottom: bottom, left: left, right: right}}>
            {content}
        </div>
    );
};

export default Popup;