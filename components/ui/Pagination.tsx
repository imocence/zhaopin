import React from 'react';

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
  const totalPages = Math.ceil(total / pageSize);
  const pages: (number | string)[] = [];

  // 最多显示5个页码
  const showPages = 5;

  if (totalPages <= showPages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (current >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', totalPages);
    }
  }

  return (
    <div className="layui-pagination flex gap-1">
      <button
        className="layui-pagination-item"
        disabled={current === 1}
        onClick={() => onChange?.(current - 1)}
      >
        上一页
      </button>

      {pages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="layui-pagination-item">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`layui-pagination-item ${current === page ? 'layui-this' : ''}`}
            onClick={() => onChange?.(page as number)}
          >
            {page}
          </button>
        )
      ))}

      <button
        className="layui-pagination-item"
        disabled={current === totalPages}
        onClick={() => onChange?.(current + 1)}
      >
        下一页
      </button>
    </div>
  );
};

export default Pagination;
