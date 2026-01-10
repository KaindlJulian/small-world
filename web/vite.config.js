import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [
        tailwindcss(),
        preact({
            prerender: {
                enabled: true,
                renderTarget: '#app',
                additionalPrerenderRoutes: ['/404'],
                previewMiddlewareEnabled: true,
                previewMiddlewareFallback: '/404',
            },
        }),
    ],
});
