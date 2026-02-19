import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()], // aktifin plugin react biar vitest paham transform jsx/tsx dari vite
  test: {
    globals: true, // biar helper seperti describe/it/expect bisa dipakai tanpa import manual
    environment: 'jsdom', // simulasi browser di node (dibutuhin buat ngetes komponen react)
    setupFiles: './src/tests/setup.ts', // file setup global untuk matcher tambahan, mock global, dll
    passWithNoTests: true, // jangan bikin run gagal kalau belum ada test (aman buat fase awal)
    coverage: {
      provider: 'v8', // pakai mesin bawaan node untuk hitung coverage test
      reportsDirectory: './coverage', // folder output hasil report coverage
      reporter: ['text', 'html', 'json-summary'], // jenis report: terminal, html, dan ringkasan json
      include: ['src/**/*.{ts,tsx}'], // file source yang mau dihitung coverage-nya
      exclude: [ // file yang dikecualikan dari hitungan coverage
        'src/**/*.d.ts',
        'src/tests/setup.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // shortcut import: '@/...' ngarah ke folder src
    },
  },
});
