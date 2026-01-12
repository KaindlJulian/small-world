import { useMemo } from 'react';

export function useGraphData(cards, searcher) {
    return useMemo(() => {
        if (!cards || !searcher) {
            return { nodes: [], links: [] };
        }
        console.log('calculating graph data');

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

        // Filter out symmetric links
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

        // Group links by source-target
        const linkMap = new Map();
        filteredLinks.forEach((link) => {
            const key = `${link.source.id}-${link.target.id}`;
            if (!linkMap.has(key)) {
                linkMap.set(key, {
                    source: link.source,
                    target: link.target,
                    bridges: [],
                });
            }
            linkMap.get(key).bridges.push(link.bridge);
        });

        //! this does create circular references
        nodes.forEach((node) => {
            node.links = [];
            linkMap.forEach(({ source, target, bridges }) => {
                if (source.id === node.id) {
                    node.links.push({ target, bridges });
                }
                if (target.id === node.id) {
                    node.links.push({ target: source, bridges });
                }
            });
        });

        nodes.sort((a, b) => b.links.length - a.links.length);

        return { nodes, links: Array.from(linkMap.values()) };
    }, [cards]);
}
