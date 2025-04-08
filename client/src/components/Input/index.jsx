import React from "react";

export const Input = ({
  label = "",
  name = "",
  type = "",
  className = "",
  inputClassName = "",
  isRequired = true,
  placeholder = "",
  value = '',
  onChange = () => {},
}) => {
  return (
    <div className={`w-50 ${className}`}>
      <label htmlFor={name} className="form-label text-muted">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        className={`form-control ${inputClassName}`}
        placeholder={placeholder}
        required={isRequired}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
