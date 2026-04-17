import React from 'react';

export interface BadgeProps {
  count?: number;
  dot?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ count, dot = false, children, className = '' }) => {
  if (dot) {
    return (
      <span className="relative inline-block">
        {children}
        <span className="layui-badge layui-badge-dot absolute -top-1 -right-1"></span>
      </span>
    );
  }

  if (children) {
    return (
      <span className="relative inline-block">
        {children}
        {count !== undefined && count > 0 && (
          <span className="layui-badge absolute -top-2 -right-2 min-w-[18px] h-[18px] text-center">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`layui-badge ${className}`}>
      {count !== undefined ? (count > 99 ? '99+' : count) : ''}
    </span>
  );
};

export default Badge;
