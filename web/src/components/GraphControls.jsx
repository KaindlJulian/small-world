import { GitCommitHorizontal, Plus, Trash2 } from 'lucide-preact';
import { useState } from 'react';

export function GraphControls({
    showRemove,
    onShowBridges,
    onAddCard,
    onRemoveCard,
    onToggleLayout,
}) {
    const [isLocked, setIsLocked] = useState(true);

    return (
        <div class='fixed bottom-4 flex'>
            <div class='flex space-x-3'>
                <button
                    class='flex cursor-pointer rounded-md bg-slate-700 px-3 py-2 tracking-wide hover:bg-slate-600 hover:shadow-lg'
                    onClick={() => onShowBridges()}
                >
                    <GitCommitHorizontal class='mr-1' />
                    Show Bridges
                </button>
                <button
                    class='flex cursor-pointer rounded-md bg-slate-700 px-3 py-2 tracking-wide hover:bg-slate-600 hover:shadow-lg'
                    onClick={() => {
                        onToggleLayout(!isLocked);
                        setIsLocked(!isLocked);
                    }}
                >
                    {isLocked ? 'Lock Graph' : 'Unlock Graph'}
                </button>
                <button
                    class='flex cursor-pointer rounded-md bg-slate-700 px-3 py-2 tracking-wide hover:bg-slate-600 hover:shadow-lg'
                    onClick={onAddCard}
                >
                    <Plus class='mr-1' />
                    Add Card
                </button>
                {showRemove && (
                    <button
                        class='flex cursor-pointer rounded-md bg-red-400 px-3 py-2 tracking-wide hover:bg-red-500 hover:shadow-lg'
                        onClick={onRemoveCard}
                    >
                        <Trash2 />
                    </button>
                )}
            </div>
        </div>
    );
}
