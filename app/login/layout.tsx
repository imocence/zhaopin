'use client';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* 隐藏根布局的 Header 和 Footer，禁止滚动条 */
        body > header { display: none !important; }
        body > main { padding: 0 !important; margin: 0 !important; }
        body > footer { display: none !important; }
        html, body { overflow: hidden !important; height: 100% !important; }
      `}</style>
      {children}
    </>
  );
}
