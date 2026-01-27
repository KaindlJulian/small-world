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
            console.log('set code because of param change');
            const ids = decode_ydke(`ydke://${ydkeUrlParam}!!!`);
            deckCodesSignal.value = Array.from(ids);
        }
    }, [ydkeUrlParam]);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['deck', codes],
        queryFn: () => fetchCards(codes),
        select: (data) => data.map(mapToCard),
        //placeholderData: (previousData) => previousData,
        enabled: codes.length > 0,
    });

    useEffect(() => {
        if (data && isSuccess) {
            console.log('set new url param');
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
        return <div>Error loading cards</div>;
    }

    const displayData = data?.filter((card) => codes.includes(card.id)) || [];
    const { nodes, links } = useGraphData(displayData, searcher);

    return (
        <div
            class={cn(
                'h-full divide-zinc-700',
                deckCodesSignal.value === null
                    ? 'flex justify-center'
                    : 'grid lg:grid-cols-[1fr_440px] lg:divide-x xl:grid-cols-[1fr_650px]',
            )}
        >
            <CardInfo />
            <div class='flex flex-col items-center justify-center'>
                {deckCodesSignal.value === null && (
                    <DeckInput
                        onInput={(list) => (deckCodesSignal.value = list)}
                    />
                )}
                {deckCodesSignal.value !== null && (
                    <>
                        <DeckForceGraph nodes={nodes} links={links} />
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
                </Sidebar>
            )}
        </div>
    );
}
