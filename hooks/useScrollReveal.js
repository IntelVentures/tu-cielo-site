// hooks/useScrollReveal.js
// Re-observes on every route change so elements on new pages are revealed.
import { useEffect } from 'react';

export function useScrollReveal(pathname) {
  useEffect(() => {
    // Small delay so Next.js has finished painting the new page DOM
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
      );

      document.querySelectorAll('.reveal, .stagger').forEach((el) => {
        // Reset so elements re-animate when navigating back to a page
        el.classList.remove('revealed');
        observer.observe(el);
      });

      return () => observer.disconnect();
    }, 80);

    return () => clearTimeout(timer);
  }, [pathname]); // re-run whenever the route changes
}
