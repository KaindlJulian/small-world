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

    useEffect(() => {
        if (ydkeUrlParam && deckCodesSignal.value === null) {
            const ids = decode_ydke(`ydke://${ydkeUrlParam}!!!`);
            deckCodesSignal.value = Array.from(ids);
        }
    }, [ydkeUrlParam, deckCodesSignal.value]);

    const deckQuery = useQuery({
        queryKey: ['deck', deckCodesSignal.value],
        queryFn: () => fetchCards(deckCodesSignal.value),
        enabled: Array.isArray(deckCodesSignal.value),
        select: (data) => {
            return data
                .filter((cardData) => cardData.type.includes('Monster'))
                .map(mapToCard);
        },
    });

    useEffect(() => {
        if (deckQuery.data && deckQuery.isSuccess) {
            const ydkeString = encode_ydke_main(
                deckQuery.data.map((c) => c.passcode),
            )
                .replace('ydke://', '')
                .replace('!!!', '');
            const encodedYdkeString = encodeURIComponent(ydkeString);
            if (encodedYdkeString !== ydkeUrlParam) {
                route(`/deck?ydke=${encodedYdkeString}`, true);
            }
        }
    }, [deckQuery.data, ydkeUrlParam, route]);

    const handleInput = (cardList) => {
        deckCodesSignal.value = cardList;
    };

    if (deckQuery.isLoading || isSearcherLoading) {
        return (
            <div class='flex h-full items-center justify-center'>
                <LoadingSpinner />
            </div>
        );
    }

    if (deckQuery.isError) {
        return <div>Error loading cards</div>;
    }

    const { nodes, links } = useGraphData(deckQuery.data, searcher);

    const cards = nodes;

    return (
        <div
            class={cn(
                'h-full divide-slate-700',
                deckCodesSignal.value === null
                    ? 'flex justify-center'
                    : 'grid lg:grid-cols-[1fr_440px] lg:divide-x xl:grid-cols-[1fr_650px]',
            )}
        >
            <CardInfo />
            <div class='flex flex-col items-center justify-center'>
                {deckCodesSignal.value === null && (
                    <DeckInput onInput={(cardList) => handleInput(cardList)} />
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
                        cards={cards}
                        onRemoveCard={(card) => {
                            deckCodesSignal.value =
                                deckCodesSignal.value.filter(
                                    (passcode) => passcode !== card.passcode,
                                );
                        }}
                        onAddCard={(card) => {
                            deckCodesSignal.value = [
                                ...deckCodesSignal.value,
                                card.passcode,
                            ];
                        }}
                    />
                </Sidebar>
            )}
        </div>
    );
}
