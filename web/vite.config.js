import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';
import Sitemap from 'vite-plugin-sitemap';

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
                additionalPrerenderRoutes: [
                    '/404',
                    '/deck',
                    '/bridge',
                    '/about',
                ],
                previewMiddlewareEnabled: true,
                previewMiddlewareFallback: '/404',
            },
        }),
        Sitemap({
            hostname: 'https://small-world-search.vercel.app',
            dynamicRoutes: ['/deck', '/bridge', '/about'],
            exclude: ['/404'],
        }),
    ],
});
