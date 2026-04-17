// 格式化薪资
export const formatSalary = (
  min: number,
  max: number,
  type: 'hourly' | 'monthly' | 'yearly'
): string => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'k';
    }
    return num.toString();
  };

  const typeLabel = {
    hourly: '时薪',
    monthly: '月薪',
    yearly: '年薪',
  }[type];

  if (min === max) {
    return `${typeLabel} $${formatNumber(min)}`;
  }

  return `${typeLabel} $${formatNumber(min)}-$${formatNumber(max)}`;
};

// 格式化日期
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}周前`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)}个月前`;
  } else {
    return `${Math.floor(diffDays / 365)}年前`;
  }
};

// 格式化完整日期
export const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 格式化浏览量
export const formatViews = (views: number): string => {
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'k';
  }
  return views.toString();
};

// 格式化申请数
export const formatApplications = (count: number): string => {
  if (count >= 100) {
    return '99+';
  }
  return count.toString();
};
