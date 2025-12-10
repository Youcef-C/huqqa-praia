import { getTranslations } from 'next-intl/server';
import { Box, Container, Typography, Grid, Paper, Divider } from '@mui/material';
import Image from 'next/image';

async function getMenuItems() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/menu`, { cache: 'no-store' });
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

						{(() => {
							// Filter items for this category
							const categoryItems = menuItems.filter((item: any) => item.category === category);

							// Get unique subcategories
							const subcategories = Array.from(new Set(categoryItems.map((item: any) => item.subcategory || 'Other')));
							// Sort: put 'Other' last, otherwise alphabetical or custom order?
							subcategories.sort((a: any, b: any) => {
								if (a === 'Other') return 1;
								if (b === 'Other') return -1;
								return a.localeCompare(b);
							});

							return (
								<Box>
									{subcategories.map((subcat: any) => {
										const subcatItems = categoryItems.filter((item: any) => (item.subcategory || 'Other') === subcat);
										if (subcatItems.length === 0) return null;

										return (
											<Box key={subcat} sx={{ mb: 6 }}>
												{/* Subcategory Header - Only show if not 'Other' or if there are multiple subcategories */}
												{(subcat !== 'Other' || subcategories.length > 1) && (
													<Typography variant="h5" sx={{
														color: '#d4af37',
														textAlign: 'center',
														mb: 4,
														fontStyle: 'italic',
														fontWeight: 600
													}}>
														{subcat}
													</Typography>
												)}

												<Grid container spacing={4}>
													{subcatItems.map((item: any) => {
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
																		{item.price.toLocaleString()} CVE
																	</Typography>
																</Box>
															</Grid>
														);
													})}
												</Grid>
											</Box>
										);
									})}
								</Box>
							);
						})()}
					</Box>
				))}
			</Container>
		</Box>
	);
}
