'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let sid = sessionStorage.getItem('tilal_sid');
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('tilal_sid', sid);
  }
  return sid;
}

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname?.startsWith('/admin')) return;

    const sessionId = getOrCreateSessionId();

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname, sessionId }),
    }).catch(() => {
      // Silent fail - never break the site
    });
  }, [pathname]);

  return null;
}
