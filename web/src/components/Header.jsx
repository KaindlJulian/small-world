import { useLocation } from 'preact-iso';

export function Header() {
    const { url } = useLocation();

    return (
        <header class='flex w-full justify-start bg-zinc-700'>
            <nav class='flex'>
                <a
                    href='/deck'
                    class={`p-3 no-underline ${(url.startsWith('/deck') || url == '/') && 'bg-zinc-600'}`}
                >
                    Deck View
                </a>
                <a
                    href='/bridge'
                    class={`p-3 no-underline ${url == '/bridge' && 'bg-zinc-600'}`}
                >
                    Bridge Explorer
                </a>
                <a
                    href='/about'
                    class={`p-3 no-underline ${url == '/about' && 'bg-zinc-600'}`}
                >
                    About
                </a>
            </nav>
        </header>
    );
}
