'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Box, Container, Typography, TextField, Button, Paper, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState, useEffect } from 'react';

export default function ReservationPage() {
	const t = useTranslations('Reservation');
	const locale = useLocale();

	const [date, setDate] = useState<Date | null>(null);
	const [time, setTime] = useState<Date | null>(null);
	const [formData, setFormData] = useState({ name: '', email: '', phone: '', guests: '' });
	const [packs, setPacks] = useState<any[]>([]);
	const [selectedPack, setSelectedPack] = useState('');
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/packs`)
			.then(res => res.json())
			.then(data => setPacks(data))
			.catch(err => console.error(err));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMsg(null);

		if (!date || !time) {
			setErrorMsg("Date and Time are required");
			return;
		}

		// Combine date and time
		const reservationDateTime = new Date(date);
		reservationDateTime.setHours(time.getHours());
		reservationDateTime.setMinutes(time.getMinutes());

		// Check if past
		if (reservationDateTime < new Date()) {
			setErrorMsg("Cannot book a reservation in the past.");
			return;
		}

		// Time Restrictions Logic
		const hours = time.getHours();
		const day = reservationDateTime.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

		// Valid Ranges:
		// Everyday: 16:00 (4PM) to 23:59
		// Late Night Carry Over:
		//   Mon-Fri Mornings (Sun-Thu Nights): 00:00 to 02:00
		//   Sat-Sun Mornings (Fri-Sat Nights): 00:00 to 04:00

		// Check Evening Slot (16:00 - 23:59)
		const isEvening = hours >= 16;

		// Check Late Night Slot
		let isLateNight = false;
		if (day === 6 || day === 0) {
			// Sat/Sun Morning (Fri/Sat Night Service) -> Open till 4AM
			if (hours < 4) isLateNight = true;
		} else {
			// Weekday Mornings (Sun-Thu Night Service) -> Open till 2AM
			if (hours < 2) isLateNight = true;
		}

		if (!isEvening && !isLateNight) {
			setErrorMsg("We are closed at this time. Open 4PM - 2AM (Weekdays) / 4AM (Weekends)");
			return;
		}

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/reservations`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					phone: formData.phone,
					guests: formData.guests,
					date: reservationDateTime.toISOString(),
					packId: selectedPack || undefined // Send packId if selected
				}),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Failed to create reservation');
			}

			setOpenSnackbar(true);
			// Reset form
			setFormData({ name: '', email: '', phone: '', guests: '' });
			setDate(null);
			setTime(null);
			setSelectedPack('');
		} catch (err: any) {
			setErrorMsg(err.message);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const isToday = date && new Date().toDateString() === date.toDateString();

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<Container maxWidth="sm" sx={{ py: 8 }}>
				<Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'primary.main', mb: 2 }}>
					{t('title')}
				</Typography>
				<Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 6 }}>
					{t('subtitle')}
				</Typography>

				<Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper', border: '1px solid #333' }}>
					<Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

						<TextField
							label={t('name')}
							name="name"
							value={formData.name}
							onChange={handleChange}
							fullWidth
							required
							variant="outlined"
							InputLabelProps={{ style: { color: '#888' } }}
							sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
						/>

						<TextField
							label={t('email')}
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							fullWidth
							required
							variant="outlined"
							InputLabelProps={{ style: { color: '#888' } }}
							sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
						/>

						<TextField
							label={t('phone')}
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							fullWidth
							required
							variant="outlined"
							InputLabelProps={{ style: { color: '#888' } }}
							sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
						/>

						<TextField
							label={t('guests')}
							name="guests"
							type="number"
							value={formData.guests}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const val = parseInt(e.target.value);
								if (val > 6) return;
								handleChange(e);
							}}
							inputProps={{ max: 6, min: 1 }}
							fullWidth
							required
							variant="outlined"
							helperText={t('maxGuests')}
							InputLabelProps={{ style: { color: '#888' } }}
							sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
						/>

						<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
							<DatePicker
								label={t('date')}
								value={date}
								onChange={(newValue) => setDate(newValue)}
								disablePast
								slotProps={{
									textField: {
										fullWidth: true,
										required: true,
										variant: 'outlined',
										InputLabelProps: { style: { color: '#888' } },
										sx: { input: { color: 'white' }, fieldset: { borderColor: '#444' }, svg: { color: '#888' } }
									}
								}}
							/>
							<TimePicker
								label={t('arrivalTime')}
								value={time}
								onChange={(newValue) => setTime(newValue)}
								minTime={isToday ? new Date() : undefined}
								slotProps={{
									textField: {
										fullWidth: true,
										required: true,
										variant: 'outlined',
										InputLabelProps: { style: { color: '#888' } },
										sx: { input: { color: 'white' }, fieldset: { borderColor: '#444' }, svg: { color: '#888' } }
									}
								}}
							/>
						</Box>

						{/* Pack Selection */}
						{packs.length > 0 && (
							<FormControl fullWidth variant="outlined" sx={{ fieldset: { borderColor: '#444' }, '&:hover fieldset': { borderColor: 'white' } }}>
								<InputLabel sx={{ color: '#888' }}>{t('selectPack')}</InputLabel>
								<Select
									value={selectedPack}
									onChange={(e) => setSelectedPack(e.target.value)}
									label={t('selectPack')}
									sx={{ color: 'white', '.MuiSvgIcon-root': { color: '#888' } }}
								>
									<MenuItem value="">
										<em>{t('noPack')}</em>
									</MenuItem>
									{packs.map((pack: any) => (
										<MenuItem key={pack.id} value={pack.id}>
											{locale === 'pt' ? pack.titlePt : (locale === 'fr' ? pack.titleFr : pack.titleEn)}
											{' '} - {t('packPrice', { price: pack.price })}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						)}

						{errorMsg && (
							<Alert severity="error" onClose={() => setErrorMsg(null)}>
								{errorMsg}
							</Alert>
						)}

						<Button type="submit" variant="contained" size="large" sx={{
							mt: 4,
							py: 2,
							bgcolor: 'primary.main',
							color: 'black',
							fontWeight: 'bold',
							'&:hover': {
								bgcolor: '#b4941f'
							}
						}}>
							{t('submit')}
						</Button>
					</Box>
				</Paper>

				<Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
					<Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
						{t('successMsg')}
					</Alert>
				</Snackbar>
			</Container>
		</LocalizationProvider>
	);
}
