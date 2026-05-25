'use client';

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* 隐藏根布局的 Header 和 Footer */
        body > header { display: none !important; }
        body > main { padding: 0 !important; margin: 0 !important; }
        body > footer { display: none !important; }
        /* 注册页背景 - 浅色渐变与登录页风格统一 */
        body { background: linear-gradient(135deg, #e8f5f3 0%, #f0f9ff 50%, #e6f7ff 100%) !important; min-height: 100vh; }
      `}</style>
      {children}
    </>
  );
}
