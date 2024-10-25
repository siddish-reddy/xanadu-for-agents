import React, { useRef, useEffect } from 'react';
import { Paragraph as ParagraphType } from '../../types/note';
import styles from './Paragraph.module.css';

interface ParagraphProps {
  paragraph: ParagraphType;
  onMount?: (paragraphId: string, element: HTMLElement) => void;
  onSelect?: (paragraphId: string) => void;
  onHover?: (paragraphId: string | null) => void;
  isConnected: boolean;
}

export const Paragraph: React.FC<ParagraphProps> = ({ 
  paragraph,
  onMount,
  onSelect,
  onHover,
  isConnected
}) => {
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (paragraphRef.current && onMount) {
      onMount(paragraph.id, paragraphRef.current);
    }
  }, [paragraph.id, onMount]);

  const handleClick = () => {
    console.log(`Selected paragraph: ${paragraph.id}`);
    onSelect?.(paragraph.id);
  };

  const handleMouseEnter = () => {
    console.log(`Hovered over paragraph: ${paragraph.id}`);
    onHover?.(paragraph.id);
  };

  const handleMouseLeave = () => {
    console.log(`Mouse left paragraph: ${paragraph.id}`);
    onHover?.(null);
  };

  return (
    <p 
      ref={paragraphRef}
      className={`
        ${styles.paragraph} 
        ${paragraph.isSelected ? styles.selected : ''}
        ${isConnected ? styles.connected : ''}
      `}
      data-paragraph-id={paragraph.id}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {paragraph.content}
    </p>
  );
};

export default Paragraph;
