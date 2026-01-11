import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				terminal: {
					bg: '#0a0a0a',
					primary: '#00ff41',
					secondary: '#ff0080',
					accent: '#00d4ff',
					muted: '#4a5568',
					text: '#e2e8f0'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'typing': {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
				'blink': {
					'0%, 50%': { opacity: '1' },
					'51%, 100%': { opacity: '0' }
				},
				'glow': {
					'0%, 100%': { textShadow: '0 0 5px currentColor' },
					'50%': { textShadow: '0 0 20px currentColor, 0 0 30px currentColor' }
				}
			},
			animation: {
				'typing': 'typing 3s steps(40, end)',
				'blink': 'blink 1s infinite',
				'glow': 'glow 2s ease-in-out infinite alternate'
			},
			fontFamily: {
				'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace']
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
