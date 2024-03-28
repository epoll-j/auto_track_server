import react from '@vitejs/plugin-react';
import { defineConfig } from '@midwayjs/hooks-kit';
import path from 'path';

export default defineConfig({
  source: './src/api',
  routes: [
    {
      baseDir: '/controller/functions',
      basePath: '/api',
    }
  ],
  vite: {
    plugins: [react()],
    resolve: {
      alias: {
        // 设置别名 "@" 指向 src 目录
        '@': path.resolve(__dirname, './src'),
      },
    }
  },
});
