import AdminLayout from '@/components/layout/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* 隐藏根布局的前台 Header 和 Footer */
        body > header { display: none !important; }
        body > main { padding: 0 !important; }
        body > footer { display: none !important; }
      `}</style>
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
