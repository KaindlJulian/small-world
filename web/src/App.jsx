import { Route, Router, hydrate, prerender as ssr } from 'preact-iso';
import React, { useEffect, useState } from 'react';
import { Header } from './components/Header.jsx';
import { Providers } from './core/Providers.jsx';
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
                <main class='h-full'>
                    <Router>
                        <Route path='/' component={DeckView} />
                        <Route path='/deck' component={DeckView} />
                        <Route default component={NotFound} />
                    </Router>
                </main>
            </Providers>
        </React.StrictMode>
    );
}

hydrate(<App />, document.getElementById('app'));

export async function prerender(data) {
    return await ssr(<App {...data} />);
}
