"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getStoredUser } from '@/lib/utils/auth-client';

export default function useRequireAuth(): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const user = getStoredUser();
      if (!user) {
        const next = encodeURIComponent(pathname || '/');
        router.replace(`/login?next=${next}`);
        return;
      }
      setChecked(true);
    } catch (e) {
      const next = encodeURIComponent(pathname || '/');
      try { router.replace(`/login?next=${next}`); } catch {}
    }
  }, [router, pathname]);

  return checked;
}
