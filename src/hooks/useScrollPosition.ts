import { useState, useCallback } from 'react';

export const useScrollPosition = (
  noteId: string, 
  onScroll?: () => void,
  recalculateAllPositions?: () => void
) => {
    const [scrollTop, setScrollTop] = useState(0);
    
    const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
      const element = event.currentTarget;
      setScrollTop(element.scrollTop);
      if (onScroll) {
        requestAnimationFrame(onScroll);
      }
      if (recalculateAllPositions) { // Trigger recalculation
        recalculateAllPositions();
      }
    }, [onScroll, recalculateAllPositions]);
    
    return { scrollTop, handleScroll };
};
