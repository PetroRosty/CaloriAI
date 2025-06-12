import type { Config } from "tailwindcss";

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
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: '#f0fdf4',
				'background-glass': 'rgba(255,255,255,0.7)',
				foreground: 'hsl(var(--foreground))',
				primary: '#22c55e',
				'primary-light': '#a7f3d0',
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: '#4ade80',
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'fitness-blue': '#3B82F6',
				'fitness-green': '#10B981',
				'fitness-purple': '#8B5CF6',
				'glass-bg': 'rgba(17, 24, 39, 0.8)',
				'glass-border': 'rgba(255, 255, 255, 0.15)',
				'glass-hover': 'rgba(255, 255, 255, 0.2)',
				'glass-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
				'card-shadow': 'rgba(60, 180, 120, 0.10)',
				'text-main': '#1e3a1a',
				'text-secondary': '#64748b',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '2rem',
				full: '999px',
			},
			boxShadow: {
				glass: '0 8px 32px 0 rgba(60, 180, 120, 0.10)',
				glassHover: '0 12px 40px 0 rgba(34,197,94,0.13)',
			},
			backdropBlur: {
				'xs': '2px',
				glass: '18px',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						filter: 'blur(8px)',
						transform: 'scale(0.98)'
					},
					'100%': {
						opacity: '1',
						filter: 'blur(0)',
						transform: 'scale(1)'
					}
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' },
				},
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'none' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-out': 'fade-out 0.2s ease-out',
				'fade-in': 'fadeIn 0.7s cubic-bezier(.39,.575,.565,1) both',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
