import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { get as getItem, del as removeItem, set as setItem } from 'idb-keyval';
import { LocationProvider } from 'preact-iso';
import { CardInfoProvider } from '../context/CardInfoContext';
import { SearcherProvider } from '../context/SearcherContext';
import { queryClient } from './queryClient';

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
