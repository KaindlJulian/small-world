import { useContext } from 'react';
import { SearcherContext } from '../context/SearcherContext.jsx';

export function useSearcher() {
    const context = useContext(SearcherContext);

    if (context === undefined) {
        throw new Error('useSearcher must be used within a SearcherProvider');
    }

    return context;
}
