import React from 'react';
import { FaGoogle } from 'react-icons/fa6';

import './Google.css';

const GoogleButton = ({ text, type = 'button', onClick }) => {
    return (
        <button className="button-google" type={type} onClick={onClick}>
            <FaGoogle /> {text}
        </button>
    );
};

export default GoogleButton;
