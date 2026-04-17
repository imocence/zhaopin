'use client';

import React, { useState } from 'react';

export interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
}

const Tabs: React.FC<TabsProps> = ({ items, defaultActiveKey }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || items[0]?.key);

  return (
    <div>
      <div className="flex border-b border-gray-200">
        {items.map((item) => (
          <button
            key={item.key}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeKey === item.key
                ? 'text-[var(--layui-primary)] border-b-2 border-[var(--layui-primary)]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveKey(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {items.find((item) => item.key === activeKey)?.content}
      </div>
    </div>
  );
};

export default Tabs;
