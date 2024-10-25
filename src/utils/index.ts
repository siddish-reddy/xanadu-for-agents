import { Link } from '../types/link';

interface OldLink {
  from: string;
  to: string[];
}

export function convertLinks(oldLinks: OldLink[]): Link[] {
  return oldLinks.flatMap(link => 
    link.to.map(target => ({
      source: link.from,
      target
    }))
  );
}

export function getConnectedParagraphs(paragraphId: string, oldLinks: OldLink[]): string[] {
  const links = convertLinks(oldLinks);
  const connectedIds = links.reduce((acc, link) => {
    if (link.source === paragraphId) {
      acc.push(link.target);
    } else if (link.target === paragraphId) {
      acc.push(link.source);
    }
    return acc;
  }, [] as string[]);

  console.log(`Connected paragraphs for ${paragraphId}:`, connectedIds);
  return connectedIds;
}
