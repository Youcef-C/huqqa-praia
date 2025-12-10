import { getTranslations } from 'next-intl/server';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import Image from 'next/image';

// Images for the schema provided in the prompt
const schemaImages = [
	'/assets/50dab014-34e0-43cd-b197-4f0da88ba115.jpeg',
	'/assets/fe28509e-bb9a-493b-bcfb-0b5ccc596d21.jpeg'
];

async function getContactInfo() {
	try {
		const res = await fetch('http://localhost:4000/api/contact', { cache: 'no-store' });
		if (!res.ok) return null;
		return res.json();
	} catch (e) {
		console.error(e);
		return null;
	}
}

export default async function ThePlacePage() {
	const t = await getTranslations('Admin.ThePlacePage');
	const contact = await getContactInfo();

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'primary.main', mb: 4 }}>
				{t('title')}
			</Typography>

			<Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 6, maxWidth: '800px', mx: 'auto' }}>
				{t('description')}
			</Typography>

			<Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
				{schemaImages.map((src, index) => (
					<Grid size={{ xs: 12, md: 8 }} key={index}>
						<Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
							<Image
								src={src}
								alt={`Schema ${index + 1}`}
								width={0}
								height={0}
								sizes="100vw"
								style={{ width: '100%', height: 'auto', display: 'block' }}
							/>
						</Paper>
					</Grid>
				))}
			</Grid>

			{/* Maps Integration */}
			{contact?.mapsUrl && (
				<Box sx={{ mt: 8, mb: 4 }}>
					<Typography variant="h4" sx={{ textAlign: 'center', color: '#d4af37', mb: 4, textTransform: 'uppercase' }}>
						Visit Us
					</Typography>
					<Paper elevation={3} sx={{ height: '400px', borderRadius: 2, overflow: 'hidden', border: '1px solid #333' }}>
						<iframe
							src={contact.mapsUrl}
							width="100%"
							height="100%"
							style={{ border: 0 }}
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
						/>
					</Paper>
					<Typography variant="body1" sx={{ textAlign: 'center', color: '#888', mt: 2 }}>
						{contact.address}
					</Typography>
				</Box>
			)}
		</Container>
	);
}
