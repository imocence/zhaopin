// Layui 颜色常量
export const LAYUI_COLORS = {
  primary: '#009688',
  red: '#ff5722',
  orange: '#ffb800',
  green: '#16baaa',
  blue: '#1e9fff',
  purple: '#a233c6',
  dark: '#2f363c',
  light: '#fafafa',
  gray: '#d2d2d2',
  border: '#e6e6e6',
  navBg: '#393D49',
} as const;

// 经验要求选项
export const EXPERIENCE_OPTIONS = [
  { value: '不限', label: '经验不限' },
  { value: '1年以下', label: '1年以下' },
  { value: '1-3年', label: '1-3年' },
  { value: '3-5年', label: '3-5年' },
  { value: '5-10年', label: '5-10年' },
  { value: '10年以上', label: '10年以上' },
];

// 学历要求选项
export const EDUCATION_OPTIONS = [
  { value: '不限', label: '学历不限' },
  { value: '高中', label: '高中' },
  { value: '大专', label: '大专' },
  { value: '本科', label: '本科' },
  { value: '硕士', label: '硕士' },
  { value: '博士', label: '博士' },
];

// 薪资类型选项
export const SALARY_TYPE_OPTIONS = [
  { value: 'hourly', label: '时薪' },
  { value: 'monthly', label: '月薪' },
  { value: 'yearly', label: '年薪' },
];

// 页面配置
export const PAGE_CONFIG = {
  pageSize: 20,
  maxPageSize: 100,
} as const;

// 网站信息
export const SITE_INFO = {
  name: '168招聘网 - 美国华人招聘平台',
  description: '美国华人168招聘网，为在美华人提供优质的求职招聘服务',
  keywords: '美国招聘,华人招聘,168招聘网,美国找工作,华人求职',
} as const;
