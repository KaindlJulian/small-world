import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            gcTime: Infinity,
            retry: 1,
        },
        dehydrateOptions: {
            shouldDehydrateQuery: (query) =>
                query.queryKey[0] !== 'small-world-searcher',
        },
    },
});

if (import.meta.env.DEV) {
    window.__TANSTACK_QUERY_CLIENT__ = queryClient;
}
