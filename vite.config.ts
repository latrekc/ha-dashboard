import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  return {
    build: isBuild
      ? {
          lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: () => 'latrekc-dashboard.js',
            name: 'latrekc-dashboard',
          },
          rollupOptions: {
            output: { entryFileNames: 'latrekc-dashboard.js' },
            external: (id) =>
              id.includes('/mocks/') || id.includes('hass-mock') || id.includes('sample-data'),
          },
        }
      : {},
  };
});
