'use client';

import React, { useEffect, useRef } from 'react';

export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onChange
}) => {
  const laypageRef = useRef<HTMLDivElement>(null);
  const laypageInitialized = useRef(false);

  useEffect(() => {
    const initLaypage = () => {
      const layui = (window as any).layui;
      if (!layui) {
        setTimeout(initLaypage, 100);
        return;
      }

      layui.use(['laypage'], function() {
        const laypage = layui.laypage;

        if (laypageRef.current && !laypageInitialized.current) {
          const totalPages = Math.ceil(total / pageSize);

          if (totalPages <= 1) {
            return;
          }

          laypage.render({
            elem: laypageRef.current,
            count: total,
            limit: pageSize,
            curr: current,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            jump: function(obj: any, first: boolean) {
              if (!first) {
                onChange?.(obj.curr);
              }
            }
          });

          laypageInitialized.current = true;
        }
      });
    };

    initLaypage();
  }, [total, pageSize, current, onChange]);

  return <div ref={laypageRef}></div>;
};

export default Pagination;
