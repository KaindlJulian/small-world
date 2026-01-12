import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchCards } from '../api/ygoprodeck.js';
import {
    CardInfo,
    DeckInput,
    DeckList,
    ForceGraph,
    Sidebar,
} from '../components';
import { Card } from '../core/Card.js';
import { useGraphData, useSearcher } from '../hooks';

export function DeckView() {
    const [deckCodes, setDeckCodes] = useState(null);
    const { searcher, isSearcherLoading } = useSearcher();

    const deckQuery = useQuery({
        queryKey: ['deck', deckCodes],
        queryFn: () => fetchCards(deckCodes),
        enabled: Array.isArray(deckCodes),
        select: (data) =>
            data
                .filter((cardData) => cardData.type.includes('Monster'))
                .map(
                    (cardData) =>
                        new Card(
                            cardData.misc_info[0].konami_id,
                            cardData.id,
                            cardData.name,
                            cardData.attribute,
                            cardData.level,
                            cardData.typeline,
                            cardData.desc,
                            cardData.atk,
                            cardData.def,
                            cardData.frameType,
                        ),
                ),
    });

    const { nodes, links } = useGraphData(deckQuery.data, searcher);

    const handleInput = (cardList) => {
        setDeckCodes(cardList);
    };

    if (deckQuery.isLoading || isSearcherLoading) {
        return <div>Loading…</div>;
    }

    if (deckQuery.isError) {
        return <div>Error loading cards</div>;
    }

    // cards of the deck including small world connections
    const cards = deckQuery.data; //! probably change to cards = nodes

    return (
        <div class='grid h-full divide-slate-600 lg:grid-cols-[1fr_440px] lg:divide-x xl:grid-cols-[1fr_650px]'>
            <CardInfo />
            <div class='flex flex-col items-center justify-center'>
                {deckCodes === null && (
                    <DeckInput onInput={(cardList) => handleInput(cardList)} />
                )}
                {deckCodes !== null && (
                    <ForceGraph nodes={nodes} links={links} />
                )}
            </div>
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
        </div>
    );
}
