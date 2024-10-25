import React, { useCallback } from 'react';
import { Note as NoteType } from '../../types/note';
import Note from './Note';
import styles from './NotesLayer.module.css';

interface NotesLayerProps {
  notes: NoteType[];
  onParagraphMount: (noteId: string, paragraphId: string, element: HTMLElement) => void;
  onScroll?: () => void;
  onNoteSelect?: (noteId: string) => void;
  onParagraphSelect?: (noteId: string, paragraphId: string) => void;
  onParagraphHover?: (noteId: string, paragraphId: string | null) => void;
  connectedParagraphIds: Set<string>;
}

export const NotesLayer: React.FC<NotesLayerProps> = ({ 
  notes,
  onParagraphMount,
  onScroll,
  onNoteSelect,
  onParagraphSelect,
  onParagraphHover,
  connectedParagraphIds
}) => {
  return (
    <div className={styles.notesLayer}>
      {notes.map(note => {
        const memoizedOnParagraphMount = useCallback(
          (paragraphId: string, element: HTMLElement) => 
            onParagraphMount(note.id, paragraphId, element),
          [onParagraphMount, note.id]
        );

        const memoizedOnParagraphSelect = useCallback(
          (paragraphId: string) => onParagraphSelect?.(note.id, paragraphId),
          [onParagraphSelect, note.id]
        );

        const memoizedOnParagraphHover = useCallback(
          (paragraphId: string | null) => {
            console.log('NotesLayer memoizedOnParagraphHover:', { noteId: note.id, paragraphId });
            if (paragraphId === null) {
              onParagraphHover?.(note.id, null);
            } else {
              onParagraphHover?.(note.id, paragraphId);
            }
          },
          [onParagraphHover, note.id]
        );

        return (
          <Note 
            key={note.id}
            note={note}
            onParagraphMount={memoizedOnParagraphMount}
            onScroll={onScroll}
            onSelect={() => onNoteSelect?.(note.id)}
            onParagraphSelect={memoizedOnParagraphSelect}
            onParagraphHover={memoizedOnParagraphHover}
            connectedParagraphIds={connectedParagraphIds}
          />
        );
      })}
    </div>
  );
};

export default NotesLayer;
