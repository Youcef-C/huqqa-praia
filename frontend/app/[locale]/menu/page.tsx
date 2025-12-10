import { getTranslations } from 'next-intl/server';
import { Box, Container, Typography, Grid, Paper, Divider } from '@mui/material';
import Image from 'next/image';

async function getMenuItems() {
	try {
		const res = await fetch('http://localhost:4000/api/menu', { cache: 'no-store' });
		if (!res.ok) return [];
		return res.json();
	} catch (error) {
		console.error("Failed to fetch menu", error);
		return [];
	}
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations('Admin.MenuPage');
	const menuItems = await getMenuItems();

	// Capitalize locale for property access (e.g., 'fr' -> 'Fr')
	const localeKey = locale.charAt(0).toUpperCase() + locale.slice(1);

	// Group by category
	const categories = Array.from(new Set(menuItems.map((item: any) => item.category)));
	const categoryOrder = ['HOOKAH', 'DRINK', 'FOOD'];
	categories.sort((a: any, b: any) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));

	return (
		<Box sx={{ pb: 8, bgcolor: 'background.default', minHeight: '100vh', pt: 4 }}>
			<Container maxWidth="lg">
				<Typography variant="h2" component="h1" gutterBottom sx={{
					textAlign: 'center',
					color: 'primary.main',
					mb: 6,
					textTransform: 'uppercase',
					letterSpacing: '0.3rem',
					fontWeight: 800
				}}>
					{t('title')}
				</Typography>

				{categories.map((category: any) => (
					<Box key={category} sx={{ mb: 8 }}>
						{/* Category Header */}
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
							<Box sx={{ height: '1px', bgcolor: 'primary.main', width: '100px', mr: 3, display: { xs: 'none', md: 'block' } }} />
							<Typography variant="h4" sx={{
								color: 'white',
								textTransform: 'uppercase',
								letterSpacing: '0.2rem',
								fontWeight: 700
							}}>
								{t(`categories.${category}` as any)}
							</Typography>
							<Box sx={{ height: '1px', bgcolor: 'primary.main', width: '100px', ml: 3, display: { xs: 'none', md: 'block' } }} />
						</Box>

						<Grid container spacing={4}>
							{menuItems.filter((item: any) => item.category === category).map((item: any) => {
								const name = item[`name${localeKey}`] || item.nameFr;
								const description = item[`description${localeKey}`] || item.descriptionFr;

								return (
									<Grid size={{ xs: 12, md: 6 }} key={item.id}>
										<Box sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'baseline',
											borderBottom: '1px solid rgba(255,255,255,0.1)',
											pb: 2,
											mb: 2
										}}>
											<Box>
												<Typography variant="h6" sx={{ color: 'white', textTransform: 'uppercase', fontWeight: 600 }}>
													{name}
												</Typography>
												{description && (
													<Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontStyle: 'italic' }}>
														{description}
													</Typography>
												)}
											</Box>
											<Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, ml: 2, whiteSpace: 'nowrap' }}>
												{item.price.toLocaleString()}
											</Typography>
										</Box>
									</Grid>
								);
							})}
						</Grid>
					</Box>
				))}
			</Container>
		</Box>
	);
}
