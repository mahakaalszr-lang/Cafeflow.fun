import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink: '#17221d', forest: '#244b3b', mint: '#e9f2ec', cream: '#f7f8f4' }, boxShadow: { soft: '0 8px 30px rgba(24, 39, 31, .06)' } } }, plugins: [] };
export default config;
