import { useOnClickOutside } from '@/hooks';
import { cn } from '@/utils';
import { Check, ChevronsUpDown } from 'lucide-preact';
import { useMemo, useRef, useState } from 'react';

export function Combobox({ items, onSelect, placeholder, filterable = true }) {
    const [query, setQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(() => setIsOpen(false), { refs: [ref] });

    const filtered = useMemo(() => {
        if (query === '' || !filterable) return items;
        return items.filter((d) =>
            d.text.toLowerCase().includes(query.toLowerCase()),
        );
    }, [query, items, filterable]);

    const displayList = filtered.slice(0, 30);

    const handleSelect = (item) => {
        setSelectedItem(item);
        setQuery(item.text);
        setIsOpen(false);
        onSelect(item);
    };

    return (
        <div ref={ref}>
            <div class='relative'>
                <input
                    id={`combobox-${crypto.randomUUID()}`}
                    type='text'
                    class='ring-offset-background inline-flex w-full rounded-md border border-zinc-600 bg-zinc-700 px-4 py-2 text-sm font-medium shadow focus-visible:ring'
                    placeholder={placeholder}
                    value={query}
                    onInput={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setSelectedItem(null);
                    }}
                    onFocus={() => setIsOpen(true)}
                />

                <div class='pointer-events-none absolute inset-y-0 right-0 ml-auto flex items-center pr-4 text-zinc-400'>
                    <ChevronsUpDown size={16} />
                </div>

                {isOpen && displayList.length > 0 && (
                    <ul
                        class={cn(
                            'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-700 p-1 text-sm shadow-lg ring-1 ring-slate-600 focus:outline-none',
                            '[&::-webkit-scrollbar-track]:transparent [scrollbar-gutter:stable] hover:overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-500',
                        )}
                    >
                        {displayList.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                class='relative cursor-default rounded-md px-4 py-2 select-none hover:bg-zinc-600'
                            >
                                <span
                                    class={`block truncate ${selectedItem?.id === item.id ? 'font-semibold' : ''}`}
                                >
                                    {item.text}
                                </span>

                                {selectedItem?.id === item.id && (
                                    <span class='absolute inset-y-0 right-0 flex items-center pr-3'>
                                        <Check size={16} />
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
