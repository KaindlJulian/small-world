import { useQuery } from '@tanstack/react-query';
import { useLocation, useRoute } from 'preact-iso';
import { useEffect, useState } from 'react';
import { fetchCards, mapToCard } from '../api/ygoprodeck.js';
import {
    CardInfo,
    DeckInput,
    DeckList,
    ForceGraph,
    Sidebar,
} from '../components';
import { useGraphData, useSearcher } from '../hooks';
import { cn } from '../utils';
import { decode_ydke, encode_ydke_main } from '../wasm';

export function DeckView() {
    const [deckCodes, setDeckCodes] = useState(null);
    const { searcher, isSearcherLoading } = useSearcher();
    const { route } = useLocation();
    const { query } = useRoute();
    const ydkeUrl = query.ydke;

    useEffect(() => {
        if (ydkeUrl && deckCodes === null) {
            const ids = decode_ydke(`ydke://${ydkeUrl}!!!`);
            setDeckCodes(Array.from(ids));
        }
    }, [ydkeUrl, deckCodes]);

    const deckQuery = useQuery({
        queryKey: ['deck', deckCodes],
        queryFn: () => fetchCards(deckCodes),
        enabled: Array.isArray(deckCodes),
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
            if (encodedYdkeString !== ydkeUrl) {
                route(`/deck?ydke=${encodedYdkeString}`, true);
            }
        }
    }, [deckQuery.data, ydkeUrl, route]);

    const handleInput = (cardList) => {
        setDeckCodes(cardList);
    };

    if (deckQuery.isLoading || isSearcherLoading) {
        return <div>Loading…</div>;
    }

    if (deckQuery.isError) {
        return <div>Error loading cards</div>;
    }

    const { nodes, links } = useGraphData(deckQuery.data, searcher);

    const cards = nodes;

    return (
        <div
            class={cn(
                'h-full divide-slate-600',
                deckCodes === null
                    ? 'flex justify-center'
                    : 'grid lg:grid-cols-[1fr_440px] lg:divide-x xl:grid-cols-[1fr_650px]',
            )}
        >
            <CardInfo />
            <div class='flex flex-col items-center justify-center'>
                {deckCodes === null && (
                    <DeckInput onInput={(cardList) => handleInput(cardList)} />
                )}
                {deckCodes !== null && (
                    <ForceGraph nodes={nodes} links={links} />
                )}
            </div>
            {deckCodes !== null && (
                <Sidebar class='col-span-2 lg:col-span-1'>
                    <DeckList
                        cards={cards}
                        onRemoveCard={(card) => {
                            setDeckCodes(
                                deckCodes.filter(
                                    (passcode) => passcode !== card.passcode,
                                ),
                            );
                        }}
                        onAddCard={(card) => {
                            setDeckCodes([...deckCodes, card.passcode]);
                        }}
                    />
                </Sidebar>
            )}
        </div>
    );
}
