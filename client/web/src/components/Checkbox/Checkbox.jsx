import './Checkbox.css';

const Checkbox = ({ label, theme = "light", onChange }) => {
    return (
        <div className={`checkbox ${theme}`}>
            <label onChange={onChange}>
                <input type="checkbox" />
                <span></span>
            </label>
            {label}
        </div>
    );
};

export default Checkbox;