import React, { useCallback, useRef, useMemo, useState } from 'react';
import { NotesLayer } from './components/NotesLayer';
import { INITIAL_NOTES, LINKS } from './data/sampleData';
import { useParagraphPositions } from './hooks/useParagraphPositions';
import { useWindowResize } from './hooks/useWindowResize';
import LinksLayer from './components/LinksLayer';
import styles from './App.module.css';
import { useSelection } from './hooks/useSelection';
import { getConnectedParagraphs } from './utils';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { positions, updatePosition, recalculateAll } = useParagraphPositions();
  const { 
    selectedNote, 
    selectedParagraph, 
    handleNoteSelect, 
    handleParagraphSelect: originalHandleParagraphSelect 
  } = useSelection();
  const [hoveredParagraphId, setHoveredParagraphId] = useState<string | null>(null);
  const [selectedParagraphId, setSelectedParagraphId] = useState<string | null>(null);
  const [connectedParagraphIds, setConnectedParagraphIds] = useState<Set<string>>(new Set());

  useWindowResize(() => {
    // Recalculate all positions on resize
    recalculateAll();
  });

  // Memoize handleParagraphMount
  const handleParagraphMount = useCallback(
    (noteId: string, paragraphId: string, element: HTMLElement) => {
      updatePosition(noteId, paragraphId, element, containerRef.current || undefined);
    },
    [updatePosition]
  );

  // For debugging
  React.useEffect(() => {
    console.log('Updated positions:', Array.from(positions.entries()));
  }, [positions]);

  const handleScroll = useCallback(() => {
    recalculateAll();
  }, [recalculateAll]);

  const notesWithSelection = useMemo(() => {
    return INITIAL_NOTES.map(note => ({
      ...note,
      isSelected: note.id === selectedNote,
      paragraphs: note.paragraphs.map(para => ({
        ...para,
        isSelected: para.id === selectedParagraph
      }))
    }));
  }, [selectedNote, selectedParagraph]);

  const handleParagraphHover = useCallback(
    (noteId: string, paragraphId: string | null) => {
      console.log(`handleParagraphHover: noteId=${noteId}, paragraphId=${paragraphId}`);
      setHoveredParagraphId(paragraphId);

      if (paragraphId) {
        const connectedIds = getConnectedParagraphs(paragraphId, LINKS);
        setConnectedParagraphIds(new Set(connectedIds));
      } else {
        setConnectedParagraphIds(new Set());
      }
    },
    [LINKS]
  );

  const handleParagraphSelect = useCallback(
    (noteId: string, paragraphId: string) => {
      console.log(`handleParagraphSelect: noteId=${noteId}, paragraphId=${paragraphId}`);
      setSelectedParagraphId(paragraphId);
      originalHandleParagraphSelect(noteId, paragraphId);

      if (paragraphId) {
        const connectedIds = getConnectedParagraphs(paragraphId, LINKS);
        setConnectedParagraphIds(new Set(connectedIds));
      } else {
        setConnectedParagraphIds(new Set());
      }
    },
    [LINKS, originalHandleParagraphSelect]
  );

  return (
    <div ref={containerRef} className={styles.app}>
      <NotesLayer 
        notes={notesWithSelection}
        onParagraphMount={handleParagraphMount}
        onScroll={handleScroll}
        onNoteSelect={handleNoteSelect}
        onParagraphSelect={handleParagraphSelect}
        onParagraphHover={handleParagraphHover}
        connectedParagraphIds={connectedParagraphIds}
      />
      <LinksLayer 
        links={LINKS}
        positions={positions}
        hoveredParagraphId={hoveredParagraphId}
        selectedParagraphId={selectedParagraphId}
      />
    </div>
  );
};

export default App;
