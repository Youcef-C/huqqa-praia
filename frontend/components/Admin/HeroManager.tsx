'use client';

import { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useTranslations } from 'next-intl';
import { updateHeroConfig } from '@/app/actions';

export default function HeroManager({ heroConfig }: { heroConfig: any }) {
	const t = useTranslations('Admin.HeroManager');
	const [fileName, setFileName] = useState('');

	return (
		<Box>
			<Typography variant="h5" sx={{ color: '#d4af37', fontWeight: 600, textTransform: 'uppercase', mb: 2 }}>
				{t('title')}
			</Typography>

			<Paper elevation={0} sx={{ p: 4, bgcolor: '#121212', border: '1px solid #333', borderRadius: 0 }}>
				<Box component="form" action={updateHeroConfig} sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>

					<Box>
						<Typography variant="caption" sx={{ color: '#888', mb: 1, display: 'block' }}>{t('uploadLabel')}</Typography>
						<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
							<Button
								variant="outlined"
								component="label"
								sx={{ color: '#d4af37', borderColor: '#d4af37', '&:hover': { borderColor: '#b4941f' } }}
							>
								{t('uploadButton')}
								<input
									type="file"
									name="video"
									hidden
									accept="video/*"
									onChange={(e) => {
										if (e.target.files && e.target.files[0]) {
											setFileName(e.target.files[0].name);
										}
									}}
								/>
							</Button>
							<Typography variant="body2" sx={{ color: '#white' }}>
								{fileName || t('noVideo')}
							</Typography>
						</Box>
					</Box>

					{heroConfig?.videoUrl && (
						<Box>
							<Typography variant="caption" sx={{ color: '#666', mb: 1, display: 'block' }}>{t('currentVideo')}</Typography>
							<Box sx={{ width: '100%', height: 200, bgcolor: 'black', position: 'relative' }}>
								<video
									src={heroConfig.videoUrl}
									style={{ width: '100%', height: '100%', objectFit: 'cover' }}
									controls
								/>
							</Box>
						</Box>
					)}

					<Button type="submit" variant="contained" sx={{ bgcolor: '#d4af37', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#b4941f' }, alignSelf: 'flex-start' }}>
						{t('updateButton')}
					</Button>
				</Box>
			</Paper>
		</Box>
	);
}
