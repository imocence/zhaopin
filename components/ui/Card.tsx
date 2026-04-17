import React from 'react';

export interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ header, footer, children, className = '' }) => {
  return (
    <div className={`layui-card ${className}`}>
      {header && (
        <div className="layui-card-header">
          {header}
        </div>
      )}
      <div className="layui-card-body">
        {children}
      </div>
      {footer && (
        <div className="layui-card-footer border-t border-gray-200 p-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
