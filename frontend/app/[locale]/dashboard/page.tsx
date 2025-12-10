import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import { updateReservationStatus } from '@/app/actions';
import MenuManager from '@/components/Admin/MenuManager';
import EventsManager from '@/components/Admin/EventsManager';
import PacksManager from '@/components/Admin/PacksManager';
import ReservationsTable from '@/components/Admin/ReservationsTable';
import HeroManager from '@/components/Admin/HeroManager';
import ContactManager from '@/components/Admin/ContactManager';
import { getTranslations } from 'next-intl/server';

// Note: We need a Client Component for the buttons to call Server Action nicely or use 'bind'.
// For simplicity in this demo, I'll make the whole page a server component that renders a client component for the table
// OR just use a form for the buttons.

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api`;

async function getReservations() {
	try {
		const res = await fetch(`${API_URL}/reservations`, { cache: 'no-store' });
		if (!res.ok) throw new Error('Failed to fetch reservations');
		return res.json();
	} catch (error) {
		console.error(error);
		return [];
	}
}

async function getMenuItems() {
	try {
		const res = await fetch(`${API_URL}/menu`, { cache: 'no-store' });
		if (!res.ok) throw new Error('Failed to fetch menu');
		return res.json();
	} catch (error) {
		console.error(error);
		return [];
	}
}

async function getEvents() {
	try {
		const res = await fetch(`${API_URL}/events`, { cache: 'no-store' });
		if (!res.ok) throw new Error('Failed to fetch events');
		return res.json();
	} catch (error) {
		console.error(error);
		return [];
	}
}

async function getPacks() {
	try {
		const res = await fetch(`${API_URL}/packs`, { cache: 'no-store' });
		if (!res.ok) throw new Error('Failed to fetch packs');
		return res.json();
	} catch (error) {
		console.error(error);
		return [];
	}
}

async function getHeroConfig() {
	try {
		const res = await fetch(`${API_URL}/hero`, { cache: 'no-store' });
		if (!res.ok) throw new Error('Failed to fetch hero config');
		return res.json();
	} catch (error) {
		console.error(error);
		return {};
	}
}

import { cookies } from 'next/headers';
import { redirect } from '@/i18n/routing';

export default async function DashboardPage({ params }: { params: { locale: string } }) {
	const { locale } = await params;
	const cookieStore = await cookies();
	const isAdmin = cookieStore.get('admin_session')?.value === 'true';

	if (!isAdmin) {
		redirect({ href: '/login', locale });
	}

	const t = await getTranslations('Admin');
	const reservations = await getReservations();
	const menuItems = await getMenuItems();
	const events = await getEvents();
	const packs = await getPacks();
	const heroConfig = await getHeroConfig();

	return (
		<Container maxWidth="lg" sx={{ py: 6, minHeight: '100vh', bgcolor: '#000' }}>
			{/* ... Header ... */}
			<Box sx={{ borderBottom: '2px solid #d4af37', pb: 2, mb: 6 }}>
				<Typography variant="h3" sx={{ color: '#d4af37', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
					{t('dashboardTitle')}
				</Typography>
			</Box>

			{/* ... Reservations ... */}
			<ReservationsTable reservations={reservations} />

			{/* Contact Management */}
			<Box sx={{ mt: 8 }}>
				<ContactManager />
			</Box>

			{/* Menu Management */}
			<Box sx={{ mt: 8 }}>
				<MenuManager menuItems={menuItems} />
			</Box>

			{/* Packs Management */}
			<Box sx={{ mt: 8 }}>
				<PacksManager packs={packs} />
			</Box>

			{/* Events Management */}
			<Box sx={{ mt: 8 }}>
				<EventsManager events={events} />
			</Box>

			{/* Hero Video Management */}
			<Box sx={{ mt: 8 }}>
				<HeroManager heroConfig={heroConfig} />
			</Box>
		</Container>
	);
}
