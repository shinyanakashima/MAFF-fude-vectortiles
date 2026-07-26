import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    // 相対パスで出力する（fgbビューアと同方針。サブパス配下でもリポジトリ名に依存しない）
    base: './',
});