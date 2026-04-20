import { useState, useEffect } from 'react';

/**
 * Custom hook to detect media query matches.
 * Centralizing this logic helps reduce redundant window resize listeners.
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    
    // Support older browsers with addListener
    if (media.addEventListener) {
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    } else {
      media.addListener(handler);
      return () => media.removeListener(handler);
    }
  }, [query]);

  return matches;
};

/**
 * Specifically for mobile detection used across the app.
 */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
