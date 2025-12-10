'use client';

import { Box, Container, Grid, Typography, IconButton, Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
	const t = useTranslations('Footer');
	const [contact, setContact] = useState<any>(null);

	useEffect(() => {
		fetch('http://localhost:4000/api/contact')
			.then(res => res.json())
			.then(data => setContact(data))
			.catch(err => console.error(err));
	}, []);

	return (
		<Box component="footer" sx={{ bgcolor: 'black', color: 'white', pt: 8, pb: 4, borderTop: '1px solid #333' }}>
			<Container maxWidth="lg">
				<Grid container spacing={4} justifyContent="space-between">

					{/* Brand / Logo */}
					<Grid size={{ xs: 12, md: 4 }}>
						<Box sx={{ position: 'relative', width: 150, height: 80, mb: 2 }}>
							<Image
								src="/assets/logo.png"
								alt="Huqqa Praia Logo"
								fill
								style={{ objectFit: 'contain' }}
							/>
						</Box>
						<Typography variant="body2" sx={{ color: '#888', maxWidth: 300 }}>
							{t('description')}
						</Typography>
					</Grid>

					{/* Contact Info */}
					<Grid size={{ xs: 12, md: 4 }}>
						<Typography variant="h6" sx={{ color: '#d4af37', mb: 2, textTransform: 'uppercase', fontWeight: 'bold' }}>
							{t('contactUs')}
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#ccc' }}>
								<LocationOnIcon sx={{ color: '#d4af37' }} />
								<Typography variant="body2">{contact?.address || t('loading')}</Typography>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#ccc' }}>
								<PhoneIcon sx={{ color: '#d4af37' }} />
								<Typography variant="body2">{contact?.phone || t('loading')}</Typography>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#ccc' }}>
								<EmailIcon sx={{ color: '#d4af37' }} />
								<Typography variant="body2">{contact?.email || t('loading')}</Typography>
							</Box>
						</Box>
					</Grid>

					{/* Socials */}
					<Grid size={{ xs: 12, md: 2 }}>
						<Typography variant="h6" sx={{ color: '#d4af37', mb: 2, textTransform: 'uppercase', fontWeight: 'bold' }}>
							{t('followUs')}
						</Typography>
						<Box sx={{ display: 'flex', gap: 1 }}>
							{contact?.instagram && (
								<IconButton
									component="a"
									href={contact.instagram}
									target="_blank"
									rel="noopener noreferrer"
									sx={{ color: 'white', '&:hover': { color: '#d4af37' } }}
								>
									<InstagramIcon />
								</IconButton>
							)}
							{contact?.facebook && (
								<IconButton
									component="a"
									href={contact.facebook}
									target="_blank"
									rel="noopener noreferrer"
									sx={{ color: 'white', '&:hover': { color: '#d4af37' } }}
								>
									<FacebookIcon />
								</IconButton>
							)}
							{contact?.whatsapp && (
								<IconButton
									component="a"
									href={contact.whatsapp}
									target="_blank"
									rel="noopener noreferrer"
									sx={{ color: 'white', '&:hover': { color: '#d4af37' } }}
								>
									<WhatsAppIcon />
								</IconButton>
							)}
						</Box>
					</Grid>
				</Grid>

				<Box sx={{ borderTop: '1px solid #222', mt: 8, pt: 4, textAlign: 'center', color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
					<Typography variant="caption">
						© {new Date().getFullYear()} Huqqa Praia. {t('allRightsReserved')}
					</Typography>

					{/* Hidden Dashboard Button */}
					<Link href="/login" style={{ textDecoration: 'none' }}>
						<Typography variant="caption" sx={{
							color: '#333',
							'&:hover': { color: '#666' },
							cursor: 'pointer',
							fontSize: '0.7rem'
						}}>
							Dashboard
						</Typography>
					</Link>
				</Box>
			</Container>
		</Box>
	);
}
