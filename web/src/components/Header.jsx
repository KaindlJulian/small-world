import { useLocation } from 'preact-iso';

export function Header() {
    const { url } = useLocation();

    return (
        <header class='flex justify-start bg-slate-700'>
            <nav class='flex'>
                <a
                    href='/deck'
                    class={`p-3 no-underline ${(url == '/deck' || url == '/') && 'bg-slate-600'}`}
                >
                    Deck View
                </a>
                <a
                    href='/bridge'
                    class={`p-3 no-underline ${url == '/bridge' && 'bg-slate-600'}`}
                >
                    Bridge Exploration
                </a>
                <a
                    href='/tutorial'
                    class={`p-3 no-underline ${url == '/tutorial' && 'bg-slate-600'}`}
                >
                    Tutorial
                </a>
            </nav>
        </header>
    );
}
