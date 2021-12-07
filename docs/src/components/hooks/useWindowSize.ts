import { useEffect, useState } from 'react';
import { onServer } from '../utils';

export interface WindowSizeInterface {
  windowWidth: number;
  windowHeight: number;
  scrollHeight: number;
}

export function useWindowSize(): WindowSizeInterface {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<WindowSizeInterface>({
    windowWidth: undefined,
    windowHeight: undefined,
    scrollHeight: undefined,
  });

  // Return if running on server
  if (onServer()) {
    return { windowWidth: 0, windowHeight: 0, scrollHeight: 0 };
  }

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollHeight: document.documentElement.scrollHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
