import './Button.css';

const Button = ({ text, type, icon, disabled, onClick }) => {
    return (
        <button className="button" type={type} disabled={disabled} onClick={onClick}>
            {icon}{text}
        </button>
    );
};

export default Button;