import { createContext, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCsv } from '../api/smallWorld.js';
import { SmallWorldSearcher, parse_csv } from '../wasm/index.js';

export const SearcherContext = createContext(null);

export function SearcherProvider({ children }) {
    const { data, isSuccess } = useQuery({
        queryKey: ['small-world-csv'],
        queryFn: fetchCsv,
        staleTime: Infinity,
        gcTime: Infinity,
        select: (rawCsv) => parse_csv(rawCsv),
    });

    const [searcher, setSearcher] = useState(null);

    useEffect(() => {
        if (!isSuccess || !data) return;

        const instance = new SmallWorldSearcher(data);
        setSearcher(instance);

        return () => {
            instance.free();
            setSearcher(null);
        };
    }, [data, isSuccess]);

    return (
        <SearcherContext.Provider value={searcher}>
            {children}
        </SearcherContext.Provider>
    );
}
