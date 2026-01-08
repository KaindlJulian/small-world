import { useState } from 'react';

export function GraphControls({ onShowBridges, onToggleLayout, onResetZoom }) {
    const [isLocked, setIsLocked] = useState(true);

    return (
        <div class='fixed bottom-4 flex'>
            <div class='flex space-x-3'>
                <button
                    class='flex cursor-pointer rounded-md bg-slate-700 px-3 py-2 tracking-wide hover:bg-slate-600 hover:shadow-lg'
                    onClick={() => onShowBridges()}
                >
                    Show Bridges
                </button>
                <button
                    class='flex cursor-pointer rounded-md bg-slate-700 px-3 py-2 tracking-wide hover:bg-slate-600 hover:shadow-lg'
                    onClick={() => {
                        onToggleLayout(!isLocked);
                        setIsLocked(!isLocked);
                    }}
                >
                    {isLocked ? 'Lock' : 'Unlock'}
                </button>
                <button
                    class='flex cursor-pointer rounded-md bg-slate-700 px-3 py-2 tracking-wide hover:bg-slate-600 hover:shadow-lg'
                    onClick={() => onResetZoom()}
                >
                    Reset Zoom
                </button>
            </div>
        </div>
    );
}
