import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { site } from '../content/site';

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

type PageMeta = {
  /** Page name. Leave out on the home page to get the plain site title. */
  title?: string;
  description: string;
  /** Path or absolute URL of the Open Graph image. Defaults to the Wave icon. */
  image?: string;
};

// Sets the page title, meta description and Open Graph tags (the SPA has a single index.html).
export function usePageMeta({ title, description, image = '/favicon-512.png' }: PageMeta) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} – ${site.name} ${site.school}` : site.fullTitle;
    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${window.location.origin}${pathname}`);
    setMeta('property', 'og:image', new URL(image, window.location.origin).href);
  }, [title, description, image, pathname]);
}
