import React from 'react';
import { FaFacebook } from 'react-icons/fa6';

import './Facebook.css';

const FacebookButton = ({ text, type = 'button', onClick }) => {
    return (
        <button className="button-facebook" type={type} onClick={onClick}>
            <FaFacebook /> {text}
        </button>
    );
};

export default FacebookButton;