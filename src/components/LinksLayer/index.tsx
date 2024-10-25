import React, { useMemo } from 'react';
import { Link } from '../../types/link';
import { ParagraphPosition } from '../../hooks/useParagraphPositions';
import styles from './LinksLayer.module.css';
import { useSelection } from '../../hooks/useSelection';

interface LinksLayerProps {
  links: Link[];
  positions: Map<string, ParagraphPosition>;
  hoveredParagraphId: string | null;
  selectedParagraphId: string | null;
}

const calculateLinkPath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  fromNoteRect: DOMRect,
  toNoteRect: DOMRect,
  fromVisible: boolean,
  toVisible: boolean
): string => {
  // Adjust start position
  let startX = start.x;
  let startY = start.y;
  if (!fromVisible) {
    // Start from the edge of the note
    startX = fromNoteRect.right - 10;
    startY = fromNoteRect.top + fromNoteRect.height / 2;
  }

  // Adjust end position
  let endX = end.x;
  let endY = end.y;
  if (!toVisible) {
    // End at the edge of the note
    endX = toNoteRect.left + 10;
    endY = toNoteRect.top + toNoteRect.height / 2;
  }

  // Clip to note boundaries
  startX = Math.min(fromNoteRect.right - 10, Math.max(fromNoteRect.left + 10, startX));
  endX = Math.min(toNoteRect.right - 10, Math.max(toNoteRect.left + 10, endX));
  startY = Math.min(fromNoteRect.bottom - 10, Math.max(fromNoteRect.top + 10, startY));
  endY = Math.min(toNoteRect.bottom - 10, Math.max(toNoteRect.top + 10, endY));

  const controlPointOffset = Math.abs(endX - startX) * 0.5;
  return `M ${startX},${startY} 
          C ${startX + controlPointOffset},${startY} 
            ${endX - controlPointOffset},${endY} 
            ${endX},${endY}`;
};

export const LinksLayer: React.FC<LinksLayerProps> = ({
  links,
  positions,
  hoveredParagraphId,
  selectedParagraphId
}) => {
  const { selectedParagraphs } = useSelection(); // Add this line

  const linkPaths = useMemo(() => {
    const noteRects = new Map<string, DOMRect>();

    // Group positions by noteId to get note boundaries
    Array.from(positions.values()).forEach(pos => {
      const noteId = pos.noteId;
      const rect = pos.visibility.rect;
      const existing = noteRects.get(noteId);

      if (!existing) {
        noteRects.set(noteId, rect);
      } else {
        // Expand rect to include this paragraph
        noteRects.set(noteId, {
          top: Math.min(existing.top, rect.top),
          bottom: Math.max(existing.bottom, rect.bottom),
          left: Math.min(existing.left, rect.left),
          right: Math.max(existing.right, rect.right),
          x: Math.min(existing.x, rect.x),
          y: Math.min(existing.y, rect.y),
          width: existing.width,
          height: existing.height + (rect.bottom - existing.bottom),
        } as DOMRect);
      }
    });

    return links.flatMap(link => {
      const fromPosition = positions.get(link.from);
      if (!fromPosition) return [];

      const fromNoteRect = noteRects.get(fromPosition.noteId);
      if (!fromNoteRect) return [];

      return link.to.flatMap(toId => {
        const toPosition = positions.get(toId);
        if (!toPosition) return [];

        const toNoteRect = noteRects.get(toPosition.noteId);
        if (!toNoteRect) return [];

        const fromRect = fromPosition.visibility.rect;
        const toRect = toPosition.visibility.rect;

        const fromVisible = fromPosition.visibility.isVisible;
        const toVisible = toPosition.visibility.isVisible;

        // Determine if this link should be highlighted
        const isHighlighted = 
          (hoveredParagraphId !== null &&
            (hoveredParagraphId === link.from || hoveredParagraphId === toId)) ||
          (selectedParagraphId !== null &&
            (selectedParagraphId === link.from || selectedParagraphId === toId));

        // Highlight connected paragraphs
        const isConnectedHighlighted = selectedParagraphs.has(toId);

        return {
          id: `${link.from}-${toId}`,
          path: calculateLinkPath(
            { x: fromRect.right, y: fromRect.top + fromRect.height / 2 },
            { x: toRect.left, y: toRect.top + toRect.height / 2 },
            fromNoteRect,
            toNoteRect,
            fromVisible,
            toVisible
          ),
          isHighlighted,
          isConnectedHighlighted, // Add this property
        };
      });
    });
  }, [links, positions, hoveredParagraphId, selectedParagraphId, selectedParagraphs]);

  return (
    <svg className={styles.linksLayer}>
      {linkPaths.map(({ id, path, isHighlighted, isConnectedHighlighted }) => (
        <path
          key={id}
          d={path}
          className={`
            ${styles.link} 
            ${isHighlighted ? styles.highlighted : ''}
            ${isConnectedHighlighted ? styles.connectedHighlighted : ''}
          `}
        />
      ))}
    </svg>
  );
};

export default LinksLayer;
