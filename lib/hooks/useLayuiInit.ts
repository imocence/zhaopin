import { useEffect } from 'react';

declare global {
  interface Window {
    layui: any;
  }
}

interface UseLayuiInitOptions {
  modules?: string[];
  callback?: (layui: any) => void;
  filter?: string;
  retryInterval?: number;
  maxRetries?: number;
}

export const useLayuiInit = ({
  modules = [],
  callback,
  filter,
  retryInterval = 100,
  maxRetries = 50,
}: UseLayuiInitOptions = {}) => {
  useEffect(() => {
    let retryCount = 0;
    let timeoutId: NodeJS.Timeout;

    const initLayui = () => {
      const layui = (window as any).layui;

      if (!layui) {
        if (retryCount < maxRetries) {
          retryCount++;
          timeoutId = setTimeout(initLayui, retryInterval);
        }
        return;
      }

      if (modules.length > 0) {
        layui.use(modules, (...args: any[]) => {
          // 如果有 filter，渲染指定的表单
          if (filter) {
            const form = layui.form;
            form.render(null, filter);
          }

          // 执行回调
          if (callback) {
            callback(layui);
          }
        });
      } else if (callback) {
        callback(layui);
      }
    };

    initLayui();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [modules, callback, filter, retryInterval, maxRetries]);
};

// 便捷 Hook：初始化 Layui 表单
export const useLayuiForm = (filter?: string) => {
  useLayuiInit({
    modules: ['form'],
    callback: (layui) => {
      const form = layui.form;
      form.render(filter);
    },
  });
};

// 便捷 Hook：初始化 Layui 导航
export const useLayuiNav = () => {
  useLayuiInit({
    modules: ['element'],
    callback: (layui) => {
      const element = layui.element;
      element.render('nav');
    },
  });
};

// 便捷 Hook：初始化 Layui 表格
export const useLayuiTable = (callback?: (layui: any) => void) => {
  useLayuiInit({
    modules: ['table', 'layer', 'form'],
    callback,
  });
};
