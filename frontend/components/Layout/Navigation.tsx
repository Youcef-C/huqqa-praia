'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from '@/components/Ui/LanguageSwitcher';

export default function Navigation() {
	const t = useTranslations('Navigation');
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const pages = [
		{ name: t('home'), path: '/' },
		{ name: t('menu'), path: '/menu' },
		{ name: t('packs'), path: '/packs' }, // Added Packs
		{ name: t('reservation'), path: '/reservation' },
		{ name: t('thePlace'), path: '/the-place' },
	];

	return (
		<AppBar position="fixed" elevation={0} sx={{ bgcolor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(5px)' }}>
			<Container maxWidth="xl">

				<Toolbar disableGutters sx={{ flexDirection: 'column', py: 1 }}>
					{/* Desktop Logo */}

					<Typography
						variant="h6"
						noWrap
						component={Link}
						href="/"
						sx={{
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'Montserrat, sans-serif',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'primary.main',
							textDecoration: 'none',
							alignItems: 'center',
							mb: 1
						}}
					>
						HUQQA BAGATELLE
					</Typography>

					{/* Mobile Header (Row) */}
					<Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
						<IconButton
							size="large"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Typography
							variant="h6"
							noWrap
							component={Link}
							href="/"
							sx={{
								fontFamily: 'Montserrat, sans-serif',
								fontWeight: 700,
								letterSpacing: '.1rem',
								color: 'primary.main',
								textDecoration: 'none',
							}}
						>
							HUQQA BAGATELLE
						</Typography>
						<LanguageSwitcher />
					</Box>

					{/* Mobile Menu Dropdown */}
					<Menu
						id="menu-appbar"
						anchorEl={anchorElNav}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						open={Boolean(anchorElNav)}
						onClose={handleCloseNavMenu}
						sx={{
							display: { xs: 'block', md: 'none' },
						}}
					>
						{pages.map((page) => (
							<MenuItem key={page.name} onClick={handleCloseNavMenu} component={Link} href={page.path}>
								<Typography textAlign="center">{page.name}</Typography>
							</MenuItem>
						))}
					</Menu>

					{/* Desktop Links (Centered below logo) */}
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 4 }}>
						{pages.map((page) => (
							<Button
								key={page.name}
								component={Link}
								href={page.path}
								onClick={handleCloseNavMenu}
								sx={{
									my: 0,
									color: 'white',
									display: 'block',
									fontWeight: 400,
									fontSize: '0.9rem',
									letterSpacing: '0.1rem',
									'&:hover': {
										color: 'primary.main'
									}
								}}
							>
								{page.name.toUpperCase()}
							</Button>
						))}
					</Box>

					{/* Desktop Language Switcher (Absolute right or integrated?) 
					    Let's put it absolute right for desktop to keep center clean
					*/}
					<Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', right: 24, top: 24 }}>
						<LanguageSwitcher />
					</Box>

				</Toolbar>
			</Container>
		</AppBar>
	);
}
