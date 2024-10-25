export interface Selection {
    type: 'note' | 'paragraph' | null;
    noteId?: string;
    paragraphId?: string;
}
