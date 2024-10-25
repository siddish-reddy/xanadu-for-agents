export interface Link {
    source: string;
    target: string;
}

export interface LinkPosition {
    start: { x: number; y: number };
    end: { x: number; y: number };
    isVisible: boolean;
}
