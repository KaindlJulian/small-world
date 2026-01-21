import { useOnClickOutside } from '@/hooks';
import { cn } from '@/utils';
import { ChevronsUpDown, X } from 'lucide-preact';
import { useMemo, useRef, useState } from 'react';

export function MultiCombobox({
    items,
    onSelect,
    placeholder,
    filter = () => true,
    dropDownAbove = false,
}) {
    const [query, setQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const inputRef = useRef(null);

    useOnClickOutside(() => setIsOpen(false), { refs: [ref] });

    const filtered = useMemo(() => {
        const availableItems = items.filter(
            (item) =>
                !selectedItems.some((s) => s.id === item.id) && filter(item),
        );

        if (query === '') return availableItems;
        return availableItems.filter((d) =>
            d.text.toLowerCase().includes(query.toLowerCase()),
        );
    }, [query, items, selectedItems, filter]);

    const displayList = filtered.slice(0, 30);

    const handleSelect = (item) => {
        const updated = [...selectedItems, item];
        setSelectedItems(updated);
        setQuery('');
        onSelect(updated);
        setIsOpen(false);
    };

    const removeId = (id) => {
        const updated = selectedItems.filter((item) => item.id !== id);
        setSelectedItems(updated);
        onSelect(updated);
    };

    return (
        <div ref={ref} class='w-full'>
            <div class='group relative'>
                <div
                    class={cn(
                        'relative flex min-h-10 w-full flex-wrap gap-1 rounded-md border border-zinc-600 bg-zinc-700 p-1.5 text-sm shadow-sm transition-colors focus-within:ring-2',
                        isOpen && 'ring-2',
                    )}
                    onClick={() => inputRef.current?.focus()}
                >
                    {selectedItems.map((item) => (
                        <span
                            key={item.id}
                            class='text-foreground flex items-center gap-1 rounded-md bg-zinc-600 py-0.5 pr-1 pl-2 text-xs'
                        >
                            {item.text}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeId(item.id);
                                }}
                                class='rounded-full p-0.5 transition-colors hover:bg-zinc-500'
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}

                    <input
                        ref={inputRef}
                        type='text'
                        id={`multicombobox-${crypto.randomUUID()}`}
                        class='min-w-20 flex-1 bg-transparent px-1 py-0.5 outline-none placeholder:text-zinc-400'
                        placeholder={
                            selectedItems.length === 0 ? placeholder : ''
                        }
                        value={query}
                        onInput={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={(e) => {
                            if (
                                e.key === 'Backspace' &&
                                query === '' &&
                                selectedItems.length > 0
                            ) {
                                removeId(
                                    selectedItems[selectedItems.length - 1].id,
                                );
                            }
                        }}
                    />

                    <div class='absolute top-2.5 right-0 ml-auto flex items-center pr-2 text-zinc-400'>
                        <ChevronsUpDown size={16} />
                    </div>
                </div>

                {isOpen && displayList.length > 0 && (
                    <ul
                        class={cn(
                            'absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-600 bg-zinc-800 p-1 text-sm shadow-xl focus:outline-none',
                            '[&::-webkit-scrollbar-track]:transparent [scrollbar-gutter:stable] hover:overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-500',
                            { 'bottom-11': dropDownAbove },
                        )}
                    >
                        {displayList.map((item) => (
                            <li
                                key={item.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(item);
                                }}
                                class='relative cursor-pointer rounded-md px-4 py-2 transition-colors select-none hover:bg-zinc-600'
                            >
                                <span class='block truncate'>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
