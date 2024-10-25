// src/components/NotesLayer/Note.tsx
import React, { useRef, useEffect, useCallback } from 'react';
import { Note as NoteType } from '../../types/note';
import {Paragraph} from './Paragraph';
import styles from './Note.module.css';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useParagraphPositions } from '../../hooks/useParagraphPositions';

interface NoteProps {
  note: NoteType;
  onParagraphMount?: (paragraphId: string, element: HTMLElement) => void;
  onScroll?: () => void;
  onSelect?: () => void;
  onParagraphSelect?: (paragraphId: string) => void;
  onParagraphHover?: (paragraphId: string | null) => void;
  connectedParagraphIds: Set<string>;
}

export const Note: React.FC<NoteProps> = ({ 
  note,
  onParagraphMount,
  onScroll,
  onSelect,
  onParagraphSelect,
  onParagraphHover,
  connectedParagraphIds
}) => {
  // Initialize useParagraphPositions first to get recalculateAll
  const { recalculateAll } = useParagraphPositions(); // Initialize first

  // Then pass recalculateAll to useScrollPosition
  const { handleScroll } = useScrollPosition(note.id, onScroll, recalculateAll); // Use after initialization

  const noteStyle = {
    left: `${note.position.x}px`,
    top: `${note.position.y}px`,
    transform: note.isSelected ? 'scale(1.02)' : 'none'
  };

  const memoizedOnParagraphHover = useCallback(
    (paragraphId: string | null) => {
      console.log('Note memoizedOnParagraphHover:', { paragraphId });
      onParagraphHover?.(paragraphId); // Remove note.id parameter
    },
    [onParagraphHover]
  );

  return (
    <div 
      className={`${styles.note} ${note.isSelected ? styles.selected : ''}`} 
      style={noteStyle}
      onClick={onSelect}
    >
      <div 
        className={styles.noteContent}
        onScroll={handleScroll}
      >
        {note.paragraphs.map(paragraph => (
          <Paragraph
            key={paragraph.id}
            paragraph={paragraph}
            onMount={onParagraphMount}
            onSelect={onParagraphSelect}
            onHover={memoizedOnParagraphHover}
            isConnected={connectedParagraphIds.has(paragraph.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Note;
