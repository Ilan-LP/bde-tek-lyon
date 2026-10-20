import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { AuthProvider } from '../../lib/auth';
import { PageBackground } from '../PageBackground';

// Root of everything under /admin: login state, the Wave background and a "noindex" tag.
// The admin area is not linked from the public site and must stay out of search engines.
// (A crawler that does not run JavaScript ignores this tag: at deployment, also send an
// `X-Robots-Tag: noindex` header for /admin from the web server.)
export function AdminRoot() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <AuthProvider>
      <PageBackground>
        <Outlet />
      </PageBackground>
    </AuthProvider>
  );
}
