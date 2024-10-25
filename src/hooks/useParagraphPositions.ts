// src/hooks/useParagraphPositions.ts
import { useState, useCallback, useRef } from 'react';

export interface VisibilityInfo {
  isVisible: boolean;
  rect: DOMRect;
}

export interface ParagraphPosition {
  noteId: string;
  paragraphId: string;
  visibility: VisibilityInfo;
}

// Add visibility calculation
const calculateVisibility = (
  rect: DOMRect, 
  containerRect: DOMRect,
  noteRect: DOMRect
): boolean => {
  const isInContainer = (
    rect.top < containerRect.bottom &&
    rect.bottom > containerRect.top &&
    rect.left < containerRect.right &&
    rect.right > containerRect.left
  );

  const isInNote = (
    rect.top >= noteRect.top &&
    rect.bottom <= noteRect.bottom
  );

  return isInContainer && isInNote;
};

interface ElementRef {
  noteId: string;
  paragraphId: string;
  element: HTMLElement;
}

export const useParagraphPositions = () => {
  const [positions, setPositions] = useState<Map<string, ParagraphPosition>>(new Map());
  const elementRefs = useRef<ElementRef[]>([]);
  const containerRef = useRef<HTMLElement | null>(null);
  const noteRects = useRef<Map<string, DOMRect>>(new Map());

  const updatePosition = useCallback((
    noteId: string,
    paragraphId: string,
    element: HTMLElement,
    container?: HTMLElement
  ) => {
    elementRefs.current.push({ noteId, paragraphId, element });
    if (container) {
      containerRef.current = container;
    }
    
    setPositions(prev => {
      const newPositions = new Map(prev);
      const rect = element.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect() || document.body.getBoundingClientRect();
      
      newPositions.set(paragraphId, {
        noteId,
        paragraphId,
        visibility: {
          isVisible: calculateVisibility(rect, containerRect, containerRect),
          rect
        }
      });
      return newPositions;
    });
  }, []);

  const recalculateAll = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    setPositions(new Map(
      elementRefs.current.map(({ noteId, paragraphId, element }) => {
        const rect = element.getBoundingClientRect();
        const noteRect = noteRects.current.get(noteId) || containerRect; // Ensure noteRect is defined

        return [
          paragraphId,
          {
            noteId,
            paragraphId,
            visibility: {
              isVisible: calculateVisibility(rect, containerRect, noteRect),
              rect
            }
          }
        ];
      })
    ));
  }, []);
  
  return {
    positions,
    updatePosition,
    recalculateAll
  };
};
