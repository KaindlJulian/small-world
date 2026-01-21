import { Trash2 } from 'lucide-preact';
import { publicAssetUrl } from '@/utils';

export function DeckGridView({ list, isRemoving, onCardClick }) {
    return (
        <div
            class='grid grid-cols-6 gap-4 p-4 lg:grid-cols-4 xl:grid-cols-5'
            data-ignore-outside-clicks='true'
        >
            {list.map((card) => (
                <div
                    key={card.id}
                    class={`group relative cursor-pointer rounded transition-transform duration-200 hover:shadow-lg ${
                        isRemoving
                            ? 'outline-2 outline-red-400 outline-dashed'
                            : 'hover:scale-110'
                    }`}
                >
                    <img
                        src={`${publicAssetUrl}/full/${card.id}.webp`}
                        alt={card.name}
                        class={`w-full rounded ${isRemoving && 'grayscale hover:opacity-50'}`}
                        onClick={() => onCardClick(card)}
                    />
                    {isRemoving && (
                        <Trash2
                            size={48}
                            strokeWidth={1.6}
                            class='group-hover:animate-fade-in pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 text-red-400 opacity-0 transition-opacity'
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
