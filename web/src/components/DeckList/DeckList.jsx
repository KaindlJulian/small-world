import { useCardInfo } from '@/hooks';
import {
    ArrowDownNarrowWide,
    ArrowDownWideNarrow,
    LayoutGrid,
    List,
} from 'lucide-preact';
import { useEffect, useState } from 'preact/hooks';
import { Button, Combobox, Modal } from '../';
import { DeckDetailsView } from './DeckDetailsView';
import { DeckGridView } from './DeckGridView';

const sortOptions = [
    { id: 'name', text: 'Name' },
    { id: 'level', text: 'Level' },
    { id: 'atk', text: 'ATK' },
    { id: 'def', text: 'DEF' },
    { id: 'links', text: 'Connections' },
];

export function DeckList({ cards, onRemoveCard }) {
    const [isGridView, setIsGridView] = useState(true);
    const [isDescending, setIsDescending] = useState(true);
    const [criteria, setCriteria] = useState('links');
    const [isRemovingCards, setIsRemovingCards] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            } else if (criteria === 'links') {
                return descending
                    ? b.links.length - a.links.length
                    : a.links.length - b.links.length;
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

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title='Add Card'
            >
                <Button onClick={() => setIsModalOpen(false)}>
                    Close Modal
                </Button>
            </Modal>
            <div class='sticky top-0 z-50 flex w-full gap-2 bg-slate-800 p-4'>
                <Button onClick={() => setIsModalOpen(true)}>Add</Button>
                <Button
                    class='remove-toggle-btn'
                    variant={isRemovingCards ? 'destructive' : 'secondary'}
                    onClick={() => setIsRemovingCards(!isRemovingCards)}
                >
                    {isRemovingCards ? 'Cancel' : 'Remove'}
                </Button>

                <Button
                    variant='secondary'
                    size='icon'
                    onClick={() => setIsGridView(!isGridView)}
                >
                    {isGridView ? <List /> : <LayoutGrid />}
                </Button>
                <div class='grow' />
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
