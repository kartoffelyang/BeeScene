import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[tailwindcss()],base:process.env.GITHUB_PAGES==='true'?'/BeeScene/':'./',server:{watch:{ignored:['**/qa/**','**/tests/**']}}});
