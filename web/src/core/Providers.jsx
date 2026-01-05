import { LocationProvider } from 'preact-iso';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { get as getItem, set as setItem, del as removeItem } from 'idb-keyval';
import { CardInfoProvider } from '../context/CardInfoContext';
import { queryClient } from './queryClient';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { SearcherProvider } from '../context/SearcherContext';

export function Providers({ children }) {
    return (
        <LocationProvider>
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{
                    persister: createAsyncStoragePersister({
                        storage: { getItem, setItem, removeItem },
                    }),
                }}
            >
                <SearcherProvider>
                    <CardInfoProvider>{children}</CardInfoProvider>
                </SearcherProvider>
            </PersistQueryClientProvider>
        </LocationProvider>
    );
}
