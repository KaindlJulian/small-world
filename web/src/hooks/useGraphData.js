import { useMemo } from 'react';

export function useGraphData(cards, searcher) {
    return useMemo(() => {
        if (!cards || !searcher) {
            return { nodes: [], links: [] };
        }

        

        const nodes = [
            { id: '1', name: 'Monster 1' },
            { id: '2', name: 'Monster 2' },
            { id: '3', name: 'Monster 3' },
        ];

        const links = [
            { source: '1', target: '2' },
            { source: '2', target: '3' },
        ];

        return { nodes, links };
    }, [cards]);
}
