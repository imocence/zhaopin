import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  block?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, block = false, className = '', ...props }, ref) => {
    return (
      <div className={block ? 'layui-input-block' : ''}>
        {label && (
          <label className="layui-form-label">{label}</label>
        )}
        <input
          ref={ref}
          className={`layui-input ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
