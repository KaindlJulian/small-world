import { useOnClickOutside } from '@/hooks';
import { Check, ChevronsUpDown } from 'lucide-preact';
import { useRef, useState } from 'react';

export function Combobox({ items, onSelect, placeholder }) {
    const [query, setQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    useOnClickOutside([ref], () => setIsOpen(false));

    const filtered =
        query === '' || (selectedItem && query === selectedItem.text)
            ? items
            : items.filter((d) =>
                  d.text.toLowerCase().includes(query.toLowerCase()),
              );

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
                    id='sort-cards-combobox'
                    type='text'
                    class='ring-offset-background inline-flex w-full rounded-md border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium shadow focus-visible:ring'
                    placeholder={placeholder}
                    value={query}
                    onInput={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setSelectedItem(null);
                    }}
                    onFocus={() => setIsOpen(true)}
                />

                <div class='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                    <ChevronsUpDown size={16} />
                </div>

                {isOpen && filtered.length > 0 && (
                    <ul class='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-700 p-1 text-sm shadow-lg ring-1 ring-slate-600 focus:outline-none'>
                        {filtered.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                class='relative cursor-default rounded-md px-4 py-2 select-none hover:bg-slate-600'
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
