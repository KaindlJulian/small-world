import { useMemo } from 'react';

export function useGraphData(cards, searcher) {
    return useMemo(() => {
        if (!cards || !searcher) {
            return { nodes: [], links: [] };
        }

        const nodes = cards;

        const idToCard = new Map();
        cards.forEach((card) => {
            idToCard.set(card.id, card);
        });

        const links = searcher
            .compute_links_within(cards.map((card) => card.id))
            .map((l) => {
                return {
                    source: idToCard.get(l.start.id),
                    bridge: idToCard.get(l.bridge.id),
                    target: idToCard.get(l.target.id),
                };
            });

        const seen = new Set();
        const filteredLinks = links.filter((link) => {
            const key1 = `${link.source.id}-${link.bridge.id}-${link.target.id}`;
            const key2 = `${link.target.id}-${link.bridge.id}-${link.source.id}`;
            if (seen.has(key1) || seen.has(key2)) {
                return false;
            }
            seen.add(key1);
            return true;
        });

        return { nodes, links: filteredLinks };
    }, [cards]);
}
