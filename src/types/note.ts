export interface Paragraph {
    id: string;
    content: string;
    position: number;
    isSelected: boolean;
    isHovered?: boolean;  // Add hover state
    linkedParagraphs: string[];  // Keep track of connected paragraphs
}

export interface Note {
    id: string;
    paragraphs: Paragraph[];
    position: {
        x: number;
        y: number;
    };
    isSelected: boolean;
}
