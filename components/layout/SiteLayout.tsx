'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 后台页面不显示前台 Header 和 Footer
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      <main className={!isAdmin ? 'flex-1' : ''}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
