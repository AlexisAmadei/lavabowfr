'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabase';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user && pathname !== '/admin/login') {
        router.replace('/admin/login');
        return;
      }
      if (user && (pathname === '/admin' || pathname === '/admin/')) {
        router.replace('/admin/dashboard');
        return;
      }
      setChecked(true);
    })();
    return () => { cancelled = true; };
  }, [router, pathname]);

  if (!checked) return null;
  return <>{children}</>;
}
