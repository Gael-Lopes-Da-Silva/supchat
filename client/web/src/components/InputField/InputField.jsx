import './InputField.css';

const InputField = ({ label, type, value, required, theme = "light", onChange }) => {
    return (
        <div className={`input-field ${theme}`}>
            <label>{label}<span>{required ? "*" : ""}</span></label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default InputField;
