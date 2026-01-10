import { useCardInfo } from '@/hooks';
import {
    ArrowDownNarrowWide,
    ArrowDownWideNarrow,
    LayoutGrid,
    List,
} from 'lucide-preact';
import { useEffect, useState } from 'preact/hooks';
import { Button, Combobox } from '../';
import { DeckDetailsView } from './DeckDetailsView';
import { DeckGridView } from './DeckGridView';

const sortOptions = [
    { id: 'name', text: 'Name' },
    { id: 'level', text: 'Level' },
    { id: 'atk', text: 'ATK' },
    { id: 'def', text: 'DEF' },
];

export function DeckList({ cards, onRemoveCard }) {
    const [isGridView, setIsGridView] = useState(true);
    const [isDescending, setIsDescending] = useState(true);
    const [criteria, setCriteria] = useState('name');
    const [isRemovingCards, setIsRemovingCards] = useState(false);
    const { setCardInfo } = useCardInfo();

    const handleCardClick = (card, forceDelete = false) => {
        if (isRemovingCards || forceDelete) {
            onRemoveCard(card);
        } else {
            setCardInfo(card);
        }
    };

    const sortCards = (criteria, descending) => {
        cards.sort((a, b) => {
            if (criteria === 'name') {
                if (descending) {
                    return a.name.localeCompare(b.name);
                } else {
                    return b.name.localeCompare(a.name);
                }
            } else {
                return descending
                    ? b[criteria] - a[criteria]
                    : a[criteria] - b[criteria];
            }
        });
    };

    useEffect(() => {
        if (!isRemovingCards) return;

        const handleGlobalClick = (event) => {
            if (event.target.closest('.deck-container')) return;
            if (event.target.closest('.remove-toggle-btn')) return;
            setIsRemovingCards(false);
        };

        document.addEventListener('click', handleGlobalClick);
        return () => document.removeEventListener('click', handleGlobalClick);
    }, [isRemovingCards]);

    if (!cards) return null;

    sortCards(criteria, isDescending);

    return (
        <>
            <div class='sticky top-0 z-50 flex w-full gap-2 bg-slate-800 p-4'>
                <Button onClick={() => {}}>Add</Button>
                <Button
                    class='remove-toggle-btn'
                    variant={isRemovingCards ? 'destructive' : 'secondary'}
                    onClick={() => setIsRemovingCards(!isRemovingCards)}
                >
                    {isRemovingCards ? 'Cancel' : 'Remove'}
                </Button>
                <div class='grow' />
                <Button
                    variant='secondary'
                    size='icon'
                    onClick={() => setIsGridView(!isGridView)}
                >
                    {isGridView ? <List /> : <LayoutGrid />}
                </Button>
                <Combobox
                    items={sortOptions}
                    placeholder='Sort by...'
                    onSelect={(item) => {
                        setCriteria(item.id);
                        sortCards(item.id, isDescending);
                    }}
                ></Combobox>
                <Button
                    variant='secondary'
                    size='icon'
                    onClick={() => {
                        sortCards(criteria, !isDescending);
                        setIsDescending(!isDescending);
                    }}
                >
                    {isDescending ? (
                        <ArrowDownWideNarrow />
                    ) : (
                        <ArrowDownNarrowWide />
                    )}
                </Button>
            </div>

            {isGridView ? (
                <DeckGridView
                    list={cards}
                    isRemovingCards={isRemovingCards}
                    onCardClick={handleCardClick}
                />
            ) : (
                <DeckDetailsView
                    list={cards}
                    isRemovingCards={isRemovingCards}
                    onCardClick={handleCardClick}
                />
            )}
        </>
    );
}
