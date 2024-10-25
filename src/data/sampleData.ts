// src/data/sampleData.ts
export const INITIAL_NOTES = [
  {
    id: 'n1',
    position: { x: 100, y: 100 },
    isSelected: false,
    paragraphs: [
      {
        id: 'n1p0',
        content: 'First paragraph of note 1.',
        position: 0,
        isSelected: false,
        linkedParagraphs: ['n2p5']
      },
      {
        id: 'n1p1',
        content: 'Second paragraph with some interesting content.',
        position: 1,
        isSelected: false,
        linkedParagraphs: []
      },
      {
        id: 'n1p2',
        content: 'Third paragraph that links to multiple places.',
        position: 2,
        isSelected: false,
        linkedParagraphs: ['n2p2', 'n2p3']
      },
      {
        id: 'n1p3',
        content: 'Fourth paragraph of note 1.',
        position: 3,
        isSelected: false,
        linkedParagraphs: ['n2p3', 'n2p4']
      }
    ]
  },
  {
    id: 'n2',
    position: { x: 600, y: 100 },
    isSelected: false,
    paragraphs: [
      {
        id: 'n2p0',
        content: 'First paragraph of note 2.',
        position: 0,
        isSelected: false,
        linkedParagraphs: []
      },
      {
        id: 'n2p1',
        content: 'Second paragraph that receives links.',
        position: 1,
        isSelected: false,
        linkedParagraphs: []
      },
      {
        id: 'n2p2',
        content: 'Third paragraph with incoming connections.',
        position: 2,
        isSelected: false,
        linkedParagraphs: []
      },
      {
        id: 'n2p3',
        content: 'Fourth paragraph linked from note 1.',
        position: 3,
        isSelected: false,
        linkedParagraphs: []
      },
      {
        id: 'n2p4',
        content: 'Fifth paragraph with final link.',
        position: 4,
        isSelected: false,
        linkedParagraphs: []
      },
      {
        id: 'n2p5',
        content: 'Sixth paragraph with final link.',
        position: 5,
        isSelected: false,
        linkedParagraphs: []
      }
    ]
  },
  {
    id: 'n3',
    position: { x: 1100, y: 100 },
    isSelected: false,
    paragraphs: [
      {
        id: 'n3p0',
        content: 'First paragraph of note 3.',
        position: 0,
        isSelected: false,
        linkedParagraphs: []
      },
      {
        id: 'n3p1',
        content: 'Second paragraph of note 3.',
        position: 1,
        isSelected: false,
        linkedParagraphs: []
      }
    ]
  }
];

export const LINKS = [
  { from: 'n1p2', to: ['n2p2', 'n2p3', 'n3p1'] },
  { from: 'n1p3', to: ['n2p3', 'n2p4'] },
  { from: 'n1p0', to: ['n2p5'] },
  { from: 'n2p0', to: ['n3p1'] },
  { from: 'n2p1', to: ['n3p1'] },
];
