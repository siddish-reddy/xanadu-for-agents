import { useState, useCallback } from 'react';

export const useSelection = () => {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [selectedParagraph, setSelectedParagraph] = useState<string | null>(null);
  const [selectedParagraphs, setSelectedParagraphs] = useState<Set<string>>(new Set()); // Add this state

  const handleNoteSelect = useCallback((noteId: string) => {
    setSelectedNote(noteId);
    setSelectedParagraph(null);
    setSelectedParagraphs(new Set()); // Reset connected highlights
  }, []);

  const handleParagraphSelect = useCallback((noteId: string, paragraphId: string) => {
    setSelectedNote(noteId);
    setSelectedParagraph(paragraphId);
    // Assuming you have access to linked paragraphs, add them to the set
    const linked = getLinkedParagraphs(paragraphId); // You need to implement this function
    setSelectedParagraphs(new Set(linked));
  }, []);

  return {
    selectedNote,
    selectedParagraph,
    selectedParagraphs, // Expose this state
    handleNoteSelect,
    handleParagraphSelect
  };
};
