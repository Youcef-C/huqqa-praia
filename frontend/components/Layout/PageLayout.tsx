import { Box, Container } from '@mui/material';
import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';

export default function PageLayout({ children }: { children: React.ReactNode }) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Navigation />
			<Box component="main" sx={{ flexGrow: 1, mt: '64px' }}>
				{children}
			</Box>
			<Footer />
		</Box>
	);
}
