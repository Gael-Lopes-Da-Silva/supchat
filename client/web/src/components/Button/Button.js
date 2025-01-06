import React from 'react';

import './Button.css';

const Button = ({ text, icon = "", type = 'button', disabled = false, onClick }) => {
    return (
        <button className="button" type={type} disabled={disabled} onClick={onClick}>
            {icon}{text}
        </button>
    );
};

export default Button;