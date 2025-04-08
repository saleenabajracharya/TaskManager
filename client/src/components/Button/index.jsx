import React from 'react';

export const Button = ({
    label = 'Button',
    type = 'button',
    className = '',
    disabled = false,
}) => {
  return (
    <button 
      type={type} 
      className={`btn btn-info text-white ${className}`} 
      disabled={disabled}
    >
      {label}
    </button>
  );
};
