import { createContext, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCsv } from '../api/smallWorld.js';
import { SmallWorldSearcher, parse_csv } from '../wasm/index.js';

export const SearcherContext = createContext(null);

export function SearcherProvider({ children }) {
    const csvQuery = useQuery({
        queryKey: ['small-world-csv'],
        queryFn: fetchCsv,
        staleTime: Infinity,
        gcTime: Infinity,
        select: (data) => parse_csv(data),
    });

    const searcherRef = useRef(null);

    if (csvQuery.data && !searcherRef.current) {
        searcherRef.current = new SmallWorldSearcher(csvQuery.data);
    }

    return (
        <SearcherContext.Provider value={{ searcher: searcherRef.current }}>
            {children}
        </SearcherContext.Provider>
    );
}
