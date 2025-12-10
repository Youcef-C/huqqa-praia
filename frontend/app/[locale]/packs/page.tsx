import { getTranslations } from 'next-intl/server';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { Link } from '@/i18n/routing';

async function getPacks() {
	try {
		const res = await fetch('http://localhost:4000/api/packs', { cache: 'no-store' });
		if (!res.ok) return [];
		return res.json();
	} catch (error) {
		console.error("Failed to fetch packs", error);
		return [];
	}
}

export default async function PacksPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations('Admin.PacksPage');
	const packs = await getPacks();

	// Capitalize locale for property access
	const localeKey = locale.charAt(0).toUpperCase() + locale.slice(1);

	return (
		<Box sx={{ pb: 8, pt: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
			<Container maxWidth="lg">
				<Typography variant="h2" component="h1" gutterBottom sx={{
					textAlign: 'center',
					color: 'primary.main',
					mb: 2,
					textTransform: 'uppercase',
					letterSpacing: '0.3rem',
					fontWeight: 800
				}}>
					{t('title')}
				</Typography>
				<Typography variant="h6" sx={{ textAlign: 'center', color: 'white', mb: 8, fontStyle: 'italic', opacity: 0.8 }}>
					{t('subtitle')}
				</Typography>

				<Grid container spacing={4} justifyContent="center">
					{packs.map((pack: any) => {
						const title = pack[`title${localeKey}`] || pack.titleFr;
						const itemsStr = pack[`items${localeKey}`] || pack.itemsFr;
						// Attempt to parse items if JSON, otherwise split by newline
						let items = [];
						try {
							items = JSON.parse(itemsStr);
						} catch (e) {
							items = itemsStr ? itemsStr.split('\n') : [];
						}
						if (!Array.isArray(items)) items = [itemsStr];

						return (
							<Grid size={{ xs: 12, md: 6, lg: 4 }} key={pack.id}>
								<Paper elevation={0} sx={{
									p: 4,
									height: '100%',
									bgcolor: 'background.paper',
									border: '1px solid #333',
									borderRadius: 0,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									transition: '0.3s',
									'&:hover': {
										borderColor: '#d4af37',
										transform: 'translateY(-5px)',
										boxShadow: '0 5px 20px rgba(0,0,0,0.5)'
									}
								}}>
									<Box sx={{
										width: '60px',
										height: '60px',
										borderRadius: '50%',
										border: '2px solid #d4af37',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										mb: 3,
										color: 'primary.main',
										typography: 'h4'
									}}>
										{pack.id}
									</Box>

									<Typography variant="h5" sx={{
										color: 'white',
										mb: 1,
										textTransform: 'uppercase',
										textAlign: 'center',
										fontWeight: 700,
										letterSpacing: '0.1rem'
									}}>
										{title}
									</Typography>

									<Typography variant="overline" sx={{ color: 'primary.main', mb: 1, letterSpacing: '0.2rem' }}>
										{pack.recommendedFor}
									</Typography>

									<Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
										{pack.price}
									</Typography>

									<Box sx={{ width: '40px', height: '2px', bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />

									<Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', alignItems: 'center' }}>
										{items.map((item: string, idx: number) => (
											<Typography key={idx} variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
												{item}
											</Typography>
										))}
									</Box>

									<Box sx={{ mt: 4 }}>
										<Link href="/reservation" style={{ textDecoration: 'none' }}>
											<Button variant="outlined" sx={{
												color: 'primary.main',
												borderColor: 'primary.main',
												px: 4,
												'&:hover': {
													bgcolor: 'primary.main',
													color: 'black'
												}
											}}>
												{t('bookNow')}
											</Button>
										</Link>
									</Box>
								</Paper>
							</Grid>
						);
					})}
				</Grid>
			</Container>
		</Box>
	);
}
