import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import {
    defineConfig
} from 'vite';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    // Dev server exposed through Warden's Traefik at https://vite.hisarweb.test
    // (wildcard cert *.hisarweb.test covers it). Runs inside the php-fpm
    // container: `warden env exec php-fpm npm run dev`.
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        // Written verbatim into public/hot -> @vite loads assets from here.
        origin: 'https://vite.hisarweb.test',
        cors: true,
        // Vite 6 blocks proxied Host headers unless allow-listed.
        allowedHosts: ['vite.hisarweb.test'],
        hmr: {
            host: 'vite.hisarweb.test',
            protocol: 'wss',
            clientPort: 443,
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
