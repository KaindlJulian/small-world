import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const asyncStoragePersister = createAsyncStoragePersister({
    storage: window.localStorage,
});

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            gcTime: Infinity,
        },
        dehydrateOptions: {
            shouldDehydrateQuery: (query) =>
                query.queryKey[0] !== 'small-world-searcher',
        },
    },
});

// devtools support
window.__TANSTACK_QUERY_CLIENT__ = queryClient;
