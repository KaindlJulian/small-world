import { useQuery } from '@tanstack/react-query';
import { createContext, useEffect, useRef, useState } from 'react';
import { fetchCsv } from '../api/smallWorld.js';
import { SmallWorldSearcher } from '../wasm/index.js';

export const SearcherContext = createContext(null);

export function SearcherProvider({ children }) {
    const { data: csvData, isSuccess } = useQuery({
        queryKey: ['small-world-csv'],
        queryFn: fetchCsv,
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const searcherRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isSuccess && csvData && !searcherRef.current) {
            console.log('creating wasm searcher instance');
            searcherRef.current = new SmallWorldSearcher(csvData);
            setIsReady(true);
        }

        return () => {
            if (searcherRef.current) {
                searcherRef.current.free();
                searcherRef.current = null;
                setIsReady(false);
            }
        };
    }, [isSuccess, csvData]);

    const contextValue = {
        searcher: searcherRef.current,
        isSearcherLoading: !isReady,
    };

    return (
        <SearcherContext.Provider value={contextValue}>
            {children}
        </SearcherContext.Provider>
    );
}
