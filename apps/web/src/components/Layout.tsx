import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Footer } from './Footer';
import { Header } from './Header';
import { PageBackground } from './PageBackground';

// Shared frame of every page: header, page content (each page builds its own sections), footer.
export function Layout() {
  const { pathname } = useLocation();

  // A new page starts at the top, like a normal website.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <PageBackground>
      <a
        href="#contenu"
        className="bg-wave-offwhite text-wave-blue sr-only rounded-xl px-4 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </PageBackground>
  );
}
