import './InputField.css';

const InputField = ({ label, type, value, required, onChange }) => {
    return (
        <div className="input-field">
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
