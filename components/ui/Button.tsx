import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'normal' | 'warm' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  block?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  block = false,
  children,
  className = '',
  ...props
}) => {
  const variantClasses: Record<string, string> = {
    primary: 'layui-btn-primary',
    normal: 'layui-btn-normal',
    warm: 'layui-btn-warm',
    danger: 'layui-btn-danger',
    outline: 'layui-btn-outline',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'layui-btn-sm',
    md: '',
    lg: 'layui-btn-lg',
  };

  const classes = [
    'layui-btn',
    variantClasses[variant],
    sizeClasses[size],
    disabled ? 'layui-btn-disabled' : '',
    block ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
