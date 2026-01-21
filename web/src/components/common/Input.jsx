import { useState } from 'react';

export function Input({ placeholder, onInput, type = 'text' }) {
    const [text, setText] = useState('');

    return (
        <input
            id={`input-${crypto.randomUUID()}`}
            type={type}
            class='number-input-no-spin ring-offset-background inline-flex w-full rounded-md border border-zinc-600 bg-zinc-700 px-4 py-2 text-sm shadow placeholder:text-zinc-400 focus-visible:ring'
            placeholder={placeholder}
            value={text}
            onInput={(e) => {
                setText(e.target.value);
                onInput(e.target.value);
            }}
        />
    );
}
