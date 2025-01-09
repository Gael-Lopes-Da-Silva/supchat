import './Button.css';

const Button = ({ text, type, icon, disabled, theme = "light", onClick }) => {
    return (
        <button className={`button ${theme}`} type={type} disabled={disabled} onClick={onClick}>
            {icon}{text}
        </button>
    );
};

export default Button;