import './Checkbox.css';

const Checkbox = ({ label, theme = "light", required, onChange }) => {
    return (
        <div className={`checkbox ${theme}`}>
            <label onChange={onChange}>
                <input type="checkbox" required={required} />
                <span></span>
            </label>
            {label}
        </div>
    );
};

export default Checkbox;