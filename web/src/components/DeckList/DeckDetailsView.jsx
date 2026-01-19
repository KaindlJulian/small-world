import { Minus } from 'lucide-preact';
import { Button } from '../';
import { CardListItem } from './CardListItem';

const attributeIconsImport = import.meta.glob('../../assets/attributes/*.svg', {
    eager: true,
    import: 'default',
});

export function DeckDetailsView({ list, isRemoving, onCardClick }) {
    return (
        <div
            class='flex flex-col gap-4 overflow-x-hidden p-4'
            data-ignore-outside-clicks='true'
        >
            {list.map((card) => (
                <div key={card.id} class='relative flex'>
                    <div
                        class={`absolute w-12 overflow-hidden pr-2 transition-all duration-300 ease-in-out ${isRemoving ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Button
                            variant='destructive'
                            size='icon'
                            onClick={() => onCardClick(card)}
                        >
                            <Minus />
                        </Button>
                    </div>
                    <CardListItem
                        card={card}
                        isRemoving={isRemoving}
                        onCardClick={onCardClick}
                    />
                </div>
            ))}
        </div>
    );
}
