import { useQuery } from '@tanstack/react-query';
import { LogOut } from 'lucide-preact';
import { useLocation, useRoute } from 'preact-iso';
import { useEffect } from 'react';
import { fetchCards, mapToCard } from '../api/ygoprodeck.js';
import {
    Button,
    CardInfo,
    DeckForceGraph,
    DeckInput,
    DeckList,
    LoadingSpinner,
    Sidebar,
} from '../components';
import { deckCodesSignal } from '../core/signals.js';
import { useGraphData, useSearcher } from '../hooks';
import { cn } from '../utils';
import { decode_ydke, encode_ydke_main } from '../wasm';

export function DeckView() {
    const { searcher, isSearcherLoading } = useSearcher();
    const { route } = useLocation();
    const { query } = useRoute();
    const ydkeUrlParam = query.ydke;
    const codes = deckCodesSignal.value || [];

    useEffect(() => {
        if (ydkeUrlParam && deckCodesSignal.value === null) {
            const ids = decode_ydke(`ydke://${ydkeUrlParam}!!!`);
            deckCodesSignal.value = Array.from(ids);
        }
    }, []);

    const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
        queryKey: ['deck', codes],
        queryFn: () => fetchCards(codes),
        select: (data) => data.map(mapToCard),
        placeholderData: (previousData) => previousData,
        enabled: codes.length > 0,
    });

    useEffect(() => {
        console.log('set url param');

        if (data && isSuccess && codes.length > 0) {
            const ydkeString = encode_ydke_main(data.map((c) => c.id))
                .replace('ydke://', '')
                .replace('!!!', '');
            const encodedYdkeString = encodeURIComponent(ydkeString);
            if (encodedYdkeString !== ydkeUrlParam) {
                route(`/deck?ydke=${encodedYdkeString}`, true);
            }
        }
    }, [deckCodesSignal.value]);

    if ((isLoading && !data) || isSearcherLoading) {
        return (
            <div class='flex h-full items-center justify-center'>
                <LoadingSpinner />
            </div>
        );
    }

    if (isError) {
        return (
            <div class='flex h-full items-center justify-center text-red-400'>
                Error loading cards
            </div>
        );
    }

    const displayData = data?.filter((card) => codes.includes(card.id)) || [];
    const { nodes, links } = useGraphData(displayData, searcher);

    return (
        <div
            class={cn(
                'h-full divide-zinc-700 transition-all',
                deckCodesSignal.value === null
                    ? 'flex justify-center'
                    : 'grid lg:grid-cols-[1fr_440px] lg:divide-x xl:grid-cols-[1fr_650px]',
            )}
        >
            <CardInfo />

            <div class='relative flex flex-col items-center justify-center overflow-hidden'>
                {deckCodesSignal.value === null ? (
                    <DeckInput
                        onInput={(list) => (deckCodesSignal.value = list)}
                    />
                ) : (
                    <>
                        <div
                            class={cn(
                                'relative h-full w-full',
                                isFetching ? 'hidden' : 'block',
                            )}
                        >
                            <DeckForceGraph nodes={nodes} links={links} />
                        </div>

                        {isFetching && (
                            <div class='absolute inset-0 z-10 flex items-center justify-center'>
                                <LoadingSpinner />
                            </div>
                        )}

                        <Button
                            className='absolute bottom-4 left-4'
                            variant='ghost'
                            onClick={() => {
                                deckCodesSignal.value = null;
                                route('/deck', true);
                            }}
                        >
                            <LogOut className='mr-1' />
                            Exit
                        </Button>
                    </>
                )}
            </div>

            {deckCodesSignal.value !== null && (
                <Sidebar class='col-span-2 lg:col-span-1'>
                    <div
                        class={cn(
                            'h-full transition-opacity',
                            isFetching && 'opacity-50',
                        )}
                    >
                        <DeckList
                            cards={displayData}
                            onRemoveCard={(card) => {
                                deckCodesSignal.value = codes.filter(
                                    (id) => id !== card.id,
                                );
                            }}
                            onAddCard={(card) => {
                                deckCodesSignal.value = [...codes, card.id];
                            }}
                        />
                    </div>
                </Sidebar>
            )}
        </div>
    );
}
