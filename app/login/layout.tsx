'use client';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(to bottom right, #f6f8fa, #e9ecef)'}}>
      <style>{`
        /* 隐藏根布局的 Header 和 Footer */
        body > header { display: none !important; }
        body > main { padding: 0 !important; }
        body > footer { display: none !important; }
      `}</style>
      {children}
    </div>
  );
}
