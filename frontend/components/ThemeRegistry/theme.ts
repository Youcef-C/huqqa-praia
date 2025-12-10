'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#d4af37', // Gold
		},
		background: {
			default: '#000000', // Pitch Black
			paper: '#121212', // Slightly lighter black for cards
		},
		text: {
			primary: '#ffffff',
			secondary: 'rgba(255, 255, 255, 0.7)',
		},
	},
	typography: {
		fontFamily: 'var(--font-montserrat), sans-serif',
		h1: { fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 700 },
		h2: { fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 700 },
		h3: { fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 700 },
		h4: { fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600 },
		h5: { fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600 },
		h6: { fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600 },
		button: { fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, letterSpacing: '0.05rem' },
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'uppercase',
					borderRadius: 0, // Sharp edges for premium feel
				},
				contained: {
					boxShadow: 'none',
					'&:hover': {
						boxShadow: 'none',
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none', // Remove default overlapping gradients in dark mode
				},
			},
		},
	},
});

export default theme;
