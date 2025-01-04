import React from 'react';

import './Button.css';

const Button = ({ text, type = 'button', disabled = false, onClick }) => {
    return (
        <button className="button" type={type} disabled={disabled} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;