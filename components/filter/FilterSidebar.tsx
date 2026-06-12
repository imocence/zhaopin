import React from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface NumberRangeValue {
  min?: number;
  max?: number;
}

export interface FilterSection {
  key: string;
  label: string;
  icon: string;
  type: 'text' | 'select' | 'number-range' | 'checkbox';
  placeholder?: string;
  options?: FilterOption[];
  value?: string | number | boolean | NumberRangeValue | undefined;
  onChange?: (value: string | number | boolean | NumberRangeValue | undefined) => void;
}

export interface FilterSidebarProps {
  title?: string;
  filters: FilterSection[];
  onReset?: () => void;
  hasActiveFilters?: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  title = '筛选条件',
  filters,
  onReset,
  hasActiveFilters = false
}) => {
  return (
    <div className="layui-card layui-card-enhanced">
      <div className="layui-card-header layui-card-header-bg layui-flex layui-flex-between">
        <div className="layui-flex layui-flex-center">
          <i className="layui-icon layui-icon-template-1 layui-font-blue layui-icon-gap"></i>
          <span className="layui-font-lg layui-font-bold layui-font-gray-light">{title}</span>
        </div>
        {hasActiveFilters && (
          <span className="layui-badge layui-badge-enhanced layui-badge-cyan">已筛选</span>
        )}
      </div>
      <div className="layui-card-body layui-p20">
        {filters.map((filter) => (
          <div key={filter.key} className="layui-form-item-enhanced">
            <label className="layui-form-label-enhanced">
              <i className={`layui-icon ${filter.icon} layui-font-gray-99 layui-icon-gap`}></i>
              {filter.label}
            </label>

            {filter.type === 'text' && (
              <input
                type="text"
                placeholder={filter.placeholder || ''}
                className="layui-input layui-input-enhanced"
                value={String(filter.value ?? '')}
                onChange={(e) => filter.onChange?.(e.target.value)}
              />
            )}

            {filter.type === 'select' && filter.options && (
              <select
                className="layui-input layui-input-enhanced"
                value={String(filter.value ?? '')}
                onChange={(e) => filter.onChange?.(e.target.value || undefined)}
              >
                <option value="">全部</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {filter.type === 'number-range' && (
              <div className="layui-flex layui-flex-center">
                <input
                  type="number"
                  placeholder="最低"
                  className="layui-input layui-input-enhanced layui-flex-item layui-mr5"
                  value={((filter.value as NumberRangeValue | undefined)?.min) ?? ''}
                  onChange={(e) => filter.onChange?.({ 
                    ...(filter.value as NumberRangeValue | undefined) || {}, 
                    min: e.target.value ? Number(e.target.value) : undefined 
                  })}
                />
                <span className="layui-font-gray layui-ml5 layui-mr5">-</span>
                <input
                  type="number"
                  placeholder="最高"
                  className="layui-input layui-input-enhanced layui-flex-item layui-ml5"
                  value={((filter.value as NumberRangeValue | undefined)?.max) ?? ''}
                  onChange={(e) => filter.onChange?.({ 
                    ...(filter.value as NumberRangeValue | undefined) || {}, 
                    max: e.target.value ? Number(e.target.value) : undefined 
                  })}
                />
              </div>
            )}

            {filter.type === 'checkbox' && (
              <label
                className="layui-flex layui-flex-center layui-gap-8 layui-font-sm layui-font-bold layui-font-gray-light layui-cursor-pointer"
                onClick={() => filter.onChange?.(!filter.value)}
              >
                <div className={`layui-verify-check${filter.value ? ' layui-verify-check--on' : ''}`}>
                  {filter.value && (
                    <i className="layui-icon layui-icon-ok layui-font-xs"></i>
                  )}
                </div>
                仅显示已认证
              </label>
            )}
          </div>
        ))}

        {onReset && (
          <div className="layui-pt20 layui-border-top">
            <button
              className="layui-btn layui-btn-fluid layui-btn-primary layui-btn-enhanced layui-border"
              onClick={onReset}
            >
              <i className="layui-icon layui-icon-search layui-icon-gap"></i>筛选
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
