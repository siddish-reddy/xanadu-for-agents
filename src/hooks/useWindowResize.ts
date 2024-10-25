import { useEffect, useCallback } from 'react';

export const useWindowResize = (onResize: () => void) => {
  const handleResize = useCallback(() => {
    requestAnimationFrame(onResize);
  }, [onResize]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
};