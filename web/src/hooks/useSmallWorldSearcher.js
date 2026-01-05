import { parse_csv, SmallWorldSearcher } from '../wasm';
import { useQuery } from '@tanstack/react-query';
import { fetchCsv } from '../api/smallWorld.js';

export function useSmallWorldSearcher() {
    const csvQuery = useQuery({
        queryKey: ['small-world-csv'],
        queryFn: fetchCsv,
        staleTime: Infinity,
        gcTime: Infinity,
    });

    return useQuery({
        queryKey: ['small-world-searcher'],
        queryFn: () => Promise.resolve(new SmallWorldSearcher(csvQuery.data)),
        enabled: csvQuery.data != null,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
