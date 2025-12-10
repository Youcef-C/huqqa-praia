'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Select, MenuItem, SelectChangeEvent, Box } from '@mui/material';

export default function LanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const handleChange = (event: SelectChangeEvent) => {
		const nextLocale = event.target.value;
		router.replace(pathname, { locale: nextLocale });
	};

	return (
		<Box>
			<Select
				value={locale}
				onChange={handleChange}
				size="small"
				sx={{
					color: 'white',
					'.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
					'&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
					'& .MuiSvgIcon-root': { color: 'white' }
				}}
			>
				<MenuItem value="fr">FR</MenuItem>
				<MenuItem value="en">EN</MenuItem>
				<MenuItem value="pt">PT</MenuItem>
			</Select>
		</Box>
	);
}
