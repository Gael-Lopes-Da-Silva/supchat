import React from "react";
import "./Select.css";

const Select = ({ theme, value, onChange, options }) => {
  return (
    <select
      className={`select-component ${theme}`}
      value={value}
      onChange={onChange}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
