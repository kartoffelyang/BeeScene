import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[tailwindcss()],base:process.env.SITE_BASE_PATH||(process.env.GITHUB_PAGES==='true'?'/BeeScene/':'./'),server:{proxy:{'/api':{target:'http://127.0.0.1:5180',changeOrigin:false}},watch:{ignored:['**/qa/**','**/tests/**']}}});
