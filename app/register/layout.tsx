'use client';

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layui-auth-shell--soft">
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
