import { Upload } from 'lucide-preact';
import { useEffect, useRef } from 'react';
import { decode_ydke, parse_ydk } from '../wasm';

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

export function DeckInput({ onInput }) {
    const inputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;
        const text = await readFileAsText(file);
        const cardList = parse_ydk(text, true);
        onInput([...new Set(cardList)]);
        inputRef.current.value = null;
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        await handleFile(e.dataTransfer.files[0]);
        inputRef.current.value = null;
    };

    useEffect(() => {
        const handlePaste = async (e) => {
            if (
                e.target.tagName === 'INPUT' ||
                e.target.tagName === 'TEXTAREA'
            ) {
                return;
            }

            e.preventDefault();
            const item = e.clipboardData.items[0];

            if (item.kind === 'file') {
                await handleFile(item.getAsFile());
            } else if (item.kind === 'string' && item.type === 'text/plain') {
                const text = e.clipboardData.getData('text');
                console.log(text);

                const cards = text.startsWith('ydke://')
                    ? decode_ydke(text, true)
                    : text.startsWith('#main')
                      ? parse_ydk(text, true)
                      : null;

                if (cards) {
                    onInput([...new Set(cards)]);
                } else {
                    alert('Unrecognized deck format in clipboard.');
                }
            }
        };

        document.addEventListener('paste', handlePaste);

        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    return (
        <div class='flex items-center justify-center lg:w-lg'>
            <label
                htmlFor='dropzone-file'
                tabIndex={0}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                onDrop={handleDrop}
                class='flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 hover:bg-slate-800'
            >
                <Upload class='h-8 w-8' />
                <div class='text-body flex flex-col items-center justify-center px-5 pt-5 pb-6'>
                    <p class='mb-2 text-sm'>
                        <span class='font-semibold'>Upload</span> a File or
                        <span class='font-semibold'> Paste </span> from
                        Clipboard
                    </p>
                    <p class='text-xs'>
                        Formats: YDK, YDKE, sensible plain text
                    </p>
                </div>
                <input
                    ref={inputRef}
                    id='dropzone-file'
                    type='file'
                    accept='.ydk'
                    multiple={false}
                    class='hidden'
                    onChange={(e) => handleFile(e.target.files[0])}
                />
            </label>
        </div>
    );
}
