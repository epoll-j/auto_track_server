import react from '@vitejs/plugin-react';
import { defineConfig } from '@midwayjs/hooks-kit';
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default defineConfig({
  source: './src/api',
  routes: [
    {
      baseDir: '/controller/functions',
      basePath: '/api',
    }
  ],
  vite: {
    plugins: [react(), createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/web/assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),],
    resolve: {
      alias: {
        // 设置别名 "@" 指向 src 目录
        '@': path.resolve(__dirname, './src'),
      },
    }
  },
});
