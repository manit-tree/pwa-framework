import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { defineConfig } from 'vite'

export default defineConfig({
    // plugins: [cssInjectedByJsPlugin()],
    css: {
        transformer: 'lightningcss',
    },
    build: {
        outDir: './dist',
        minify: false,
        sourcemap: false,
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        }
    }
})