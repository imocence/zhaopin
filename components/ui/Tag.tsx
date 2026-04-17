import React from 'react';

export type TagVariant = 'primary' | 'red' | 'orange' | 'green' | 'blue' | 'outline';

export interface TagProps {
  variant?: TagVariant;
  children: React.ReactNode;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ variant = 'primary', children, className = '' }) => {
  const variantClasses: Record<TagVariant, string> = {
    primary: 'layui-tag-primary',
    red: 'layui-tag-red',
    orange: 'layui-tag-orange',
    green: 'layui-tag-green',
    blue: 'layui-tag-blue',
    outline: 'layui-tag-outline',
  };

  return (
    <span className={`layui-tag ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Tag;
