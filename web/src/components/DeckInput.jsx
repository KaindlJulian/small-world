import { Upload } from 'lucide-preact';
import { useRef } from 'react';

export function DeckInput({ onFile, onText }) {
    const inputRef = useRef(null);

    const handleFile = (file) => {
        if (!file || file.length === 0) return;
        onFile(file);
        inputRef.current.value = null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
        inputRef.current.value = null;
    };

    const handlePaste = (e) => {
        const item = e.clipboardData.items[0];
        if (item.kind === 'file') {
            onFile(item.getAsFile());
        } else if (item.kind === 'string' && item.type === 'text/plain') {
            item.getAsString((value) => {
                onText(value);
            });
        }
    };

    return (
        <div class='flex items-center justify-center lg:w-lg'>
            <label
                htmlFor='dropzone-file'
                tabIndex={0}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                onDrop={handleDrop}
                onPaste={handlePaste}
                class='flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 hover:bg-slate-800'
            >
                <Upload class='h-8 w-8' />
                <div class='text-body flex flex-col items-center justify-center px-5 pt-5 pb-6'>
                    <p class='mb-2 text-sm'>
                        <span class='font-semibold'>Upload a File</span> or
                        paste from clipboard
                    </p>
                    <p class='text-xs'>Formats: YDK, YDKE, plain text</p>
                </div>
                <input
                    ref={inputRef}
                    id='dropzone-file'
                    type='file'
                    accept='.ydk'
                    multiple={false}
                    class='hidden'
                    onChange={(e) => handleFile(e.target.files)}
                />
            </label>
        </div>
    );
}
