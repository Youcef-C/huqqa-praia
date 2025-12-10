'use client';

import { useState, useEffect } from 'react';
import {
	Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, IconButton, Box, Typography,
	TablePagination, TextField, InputAdornment
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { updateReservationStatus } from '@/app/actions';
import { useTranslations } from 'next-intl';

interface Reservation {
	id: number;
	date: string;
	name: string;
	email: string;
	phone: string;
	guests: number;
	status: string;
	pack?: {
		titleFr: string;
		titleEn: string;
		titlePt: string;
	};
}

export default function ReservationsTable({ reservations }: { reservations: Reservation[] }) {
	const t = useTranslations('Admin');
	const [showArchived, setShowArchived] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Pagination & Search State
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState('');

	// Effect to mark component as mounted (client-side only)
	useEffect(() => {
		setMounted(true);
	}, []);

	// Don't render until mounted to avoid hydration mismatch with Dates
	if (!mounted) return null;

	const now = new Date();
	const activeReservations = reservations.filter(r => new Date(r.date) >= now);
	const archivedReservations = reservations.filter(r => new Date(r.date) < now);

	const listToFilter = showArchived ? archivedReservations : activeReservations;

	// Filter by search
	const filteredReservations = listToFilter.filter(res =>
		res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
		res.phone.includes(searchTerm)
	);

	// Pagination logic
	const displayedReservations = filteredReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<Box>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
				<Typography variant="h5" sx={{ color: 'white', fontWeight: 600, borderLeft: '4px solid #d4af37', pl: 2 }}>
					{showArchived ? "ARCHIVED RESERVATIONS" : t('reservationsTitle')}
				</Typography>

				<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
					<TextField
						placeholder="Search..."
						variant="outlined"
						size="small"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon sx={{ color: '#888' }} />
								</InputAdornment>
							),
							style: { color: 'white' }
						}}
						sx={{
							bgcolor: '#121212',
							fieldset: { borderColor: '#333' },
							'&:hover fieldset': { borderColor: '#d4af37' },
							input: { color: 'white' },
							width: 250
						}}
					/>
					<Button
						onClick={() => {
							setShowArchived(!showArchived);
							setPage(0); // Reset page on switch
						}}
						endIcon={showArchived ? <ArrowBackIcon /> : <ArrowForwardIcon />}
						sx={{ color: '#d4af37', borderColor: '#d4af37' }}
						variant="outlined"
					>
						{showArchived ? "Back to Active" : "View Archive"}
					</Button>
				</Box>
			</Box>

			<TableContainer component={Paper} sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 0, mb: 6 }}>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: '#000' }}>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('reservationsTable.date')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('reservationsTable.name')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('reservationsTable.guests')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('reservationsTable.pack')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('reservationsTable.contact')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('reservationsTable.status')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('reservationsTable.actions')}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{displayedReservations.map((res) => (
							<TableRow key={res.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell sx={{ color: 'white', borderBottom: '1px solid #222' }}>{new Date(res.date).toLocaleDateString()} {new Date(res.date).toLocaleTimeString()}</TableCell>
								<TableCell sx={{ color: 'white', fontWeight: 'bold', borderBottom: '1px solid #222' }}>{res.name}</TableCell>
								<TableCell sx={{ color: 'white', borderBottom: '1px solid #222' }}>{res.guests}</TableCell>
								<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #222' }}>{res.pack?.titleEn || '-'}</TableCell>
								<TableCell sx={{ color: '#aaa', borderBottom: '1px solid #222', fontSize: '0.9em' }}>{res.email}<br />{res.phone}</TableCell>
								<TableCell sx={{ borderBottom: '1px solid #222' }}>
									<Chip
										label={t(`reservationsTable.statusValues.${res.status}`)}
										sx={{
											bgcolor: res.status === 'CONFIRMED' ? 'rgba(76, 175, 80, 0.2)' : res.status === 'PENDING' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(211, 47, 47, 0.2)',
											color: res.status === 'CONFIRMED' ? '#66bb6a' : res.status === 'PENDING' ? '#ffa726' : '#ef5350',
											border: '1px solid',
											borderColor: res.status === 'CONFIRMED' ? '#66bb6a' : res.status === 'PENDING' ? '#ffa726' : '#ef5350',
											fontWeight: 'bold',
											borderRadius: 0
										}}
									/>
								</TableCell>
								<TableCell sx={{ borderBottom: '1px solid #222' }}>
									<Box sx={{ display: 'flex', gap: 1 }}>
										{!showArchived && (
											<>
												<Button onClick={() => updateReservationStatus(res.id, 'CONFIRMED')} size="small" variant="outlined" sx={{ color: '#66bb6a', borderColor: '#66bb6a', '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)', borderColor: '#66bb6a' } }}>✓</Button>
												<Button onClick={() => updateReservationStatus(res.id, 'CANCELLED')} size="small" variant="outlined" sx={{ color: '#ef5350', borderColor: '#ef5350', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)', borderColor: '#ef5350' } }}>✕</Button>
											</>
										)}
										{showArchived && <Typography variant="caption" sx={{ color: '#666' }}>Archived</Typography>}
									</Box>
								</TableCell>
							</TableRow>
						))}
						{displayedReservations.length === 0 && (
							<TableRow>
								<TableCell colSpan={7} align="center" sx={{ color: '#aaa', py: 4 }}>
									{showArchived ? "No archived reservations" : t('reservationsTable.noReservations')}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={filteredReservations.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				sx={{ color: 'white', '.MuiTablePagination-selectIcon': { color: 'white' } }}
			/>
		</Box >
	);
}
