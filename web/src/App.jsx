import { Route, Router, hydrate, prerender as ssr } from 'preact-iso';
import React, { useEffect, useState } from 'react';
import { Header } from './components';
import { Providers } from './core/Providers.jsx';
import { BridgeExplore } from './pages/BridgeExplore.jsx';
import { DeckView } from './pages/DeckView.jsx';
import { NotFound } from './pages/_404.jsx';
import init from './wasm';

export function App() {
    const [isWasmReady, setWasmReady] = useState(false);

    useEffect(() => {
        init().then(() => {
            setWasmReady(true);
        });
    }, []);

    if (!isWasmReady) {
        return <div>Loading wasm</div>;
    }

    return (
        <React.StrictMode>
            <Providers>
                <Header />
                <main class='absolute top-12 h-[calc(100%-48px)] w-full'>
                    <Router>
                        <Route path='/' component={DeckView} />
                        <Route path='/deck' component={DeckView} />
                        <Route path='/bridge' component={BridgeExplore} />
                        <Route default component={NotFound} />
                    </Router>
                </main>
            </Providers>
        </React.StrictMode>
    );
}

if (typeof window !== 'undefined') {
    hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
    return await ssr(<App {...data} />);
}
