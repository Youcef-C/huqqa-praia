'use client';

import { useState } from 'react';
import {
	Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
	Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
	TablePagination, InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { createEvent, deleteEvent, updateEvent } from '@/app/actions';
import { useTranslations } from 'next-intl';

export default function EventsManager({ events }: { events: any[] }) {
	const t = useTranslations('Admin.EventsManager');
	const [open, setOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<any | null>(null);
	const [eventToDelete, setEventToDelete] = useState<number | null>(null);
	const [fileName, setFileName] = useState<string>('');

	// Pagination & Search
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState('');

	const handleClickOpen = (event?: any) => {
		setEditingEvent(event || null);
		setFileName(''); // Reset filename on open
		setOpen(true);
	};

	// ... (rest of code)
	const handleClose = () => {
		setOpen(false);
		setEditingEvent(null);
	};

	const handleDeleteClick = (id: number) => {
		setEventToDelete(id);
		setDeleteOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (eventToDelete) {
			await deleteEvent(eventToDelete);
		}
		setDeleteOpen(false);
		setEventToDelete(null);
	};

	const handleDeleteCancel = () => {
		setDeleteOpen(false);
		setEventToDelete(null);
	};

	// Filter
	const filteredEvents = events.filter(event =>
		event.titleFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
		event.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Pagination
	const displayedEvents = filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
				<Typography variant="h5" sx={{ color: '#d4af37', fontWeight: 600, textTransform: 'uppercase' }}>{t('title')}</Typography>
				<Box sx={{ display: 'flex', gap: 2 }}>
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
							width: 200
						}}
					/>
					<Button
						variant="contained"
						onClick={() => handleClickOpen()}
						sx={{
							bgcolor: '#d4af37',
							color: 'black',
							fontWeight: 'bold',
							borderRadius: 0,
							'&:hover': { bgcolor: '#b4941f' }
						}}
					>
						{t('addEvent')}
					</Button>
				</Box>
			</Box>

			<TableContainer component={Paper} sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 0 }}>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: '#000' }}>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('tableHeaders.date')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('tableHeaders.titleFr')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('tableHeaders.image')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold', width: 100 }}>{t('tableHeaders.actions')}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{displayedEvents.map((event) => (
							<TableRow key={event.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell sx={{ color: 'white', borderBottom: '1px solid #222' }}>
									{new Date(event.date).toLocaleDateString()}
								</TableCell>
								<TableCell sx={{ color: 'white', borderBottom: '1px solid #222' }}>{event.titleFr}</TableCell>
								<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #222' }}>
									{event.image ? t('imageExists.yes') : t('imageExists.no')}
								</TableCell>
								<TableCell sx={{ borderBottom: '1px solid #222' }}>
									<Box sx={{ display: 'flex' }}>
										<IconButton onClick={() => handleClickOpen(event)} sx={{ color: '#aaa', '&:hover': { color: '#d4af37' } }}>
											<EditIcon />
										</IconButton>
										<IconButton onClick={() => handleDeleteClick(event.id)} sx={{ color: '#d32f2f', '&:hover': { color: '#ffcdd2' } }}>
											<DeleteIcon />
										</IconButton>
									</Box>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={filteredEvents.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				sx={{ color: 'white', '.MuiTablePagination-selectIcon': { color: 'white' } }}
			/>

			{/* Confirm Delete Dialog */}
			<Dialog
				open={deleteOpen}
				onClose={handleDeleteCancel}
				PaperProps={{
					sx: {
						bgcolor: '#121212',
						border: '1px solid #d4af37',
						borderRadius: 0,
						color: 'white',
						minWidth: '400px'
					}
				}}
			>
				<DialogTitle sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 600 }}>{t('dialog.confirmDeleteTitle')}</DialogTitle>
				<DialogContent sx={{ mt: 2 }}>
					<Typography sx={{ color: 'white' }}>{t('dialog.confirmDeleteMsg')}</Typography>
				</DialogContent>
				<DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
					<Button onClick={handleDeleteCancel} sx={{ color: '#888' }}>{t('dialog.cancel')}</Button>
					<Button onClick={handleDeleteConfirm} variant="contained" sx={{ bgcolor: '#d32f2f', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#b71c1c' } }}>{t('dialog.delete')}</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={open}
				onClose={handleClose}
				PaperProps={{
					sx: {
						bgcolor: '#121212',
						border: '1px solid #d4af37',
						borderRadius: 0,
						color: 'white',
						minWidth: '500px'
					}
				}}
			>
				<form action={async (formData) => {
					if (editingEvent) {
						await updateEvent(editingEvent.id, formData);
					} else {
						await createEvent(formData);
					}
					handleClose();
				}}>
					<DialogTitle sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 600 }}>{editingEvent ? t('dialog.editEvent') : t('dialog.addEventTitle')}</DialogTitle>
					<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>

						{/* Titles */}
						<Typography variant="subtitle2" sx={{ color: '#888', mt: 1 }}>{t('form.titles')}</Typography>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<TextField autoFocus name="titleFr" defaultValue={editingEvent?.titleFr || ''} label={t('form.titleFr')} fullWidth required variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }} />
							<TextField name="titleEn" defaultValue={editingEvent?.titleEn || ''} label={t('form.titleEn')} fullWidth variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }} />
							<TextField name="titlePt" defaultValue={editingEvent?.titlePt || ''} label={t('form.titlePt')} fullWidth variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }} />
						</Box>

						{/* Date & Image */}
						<Typography variant="subtitle2" sx={{ color: '#888', mt: 1 }}>{t('form.details')}</Typography>
						<Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
							<TextField
								name="date"
								label={t('form.date')}
								type="date"
								defaultValue={editingEvent?.date ? new Date(editingEvent.date).toISOString().split('T')[0] : ''}
								fullWidth
								required
								InputLabelProps={{ shrink: true, style: { color: '#888' } }}
								variant="outlined"
								sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
							/>

							{/* Custom File Input Container to match TextField height/style */}
							<Box sx={{
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								gap: 1
							}}>
								<Box
									sx={{
										border: '1px solid #444',
										borderRadius: 1,
										p: '16.5px 14px', // Standard MUI OutlinedInput padding
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										'&:hover': { borderColor: 'white' }
									}}
								>
									<Typography variant="body1" sx={{ color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
										{fileName ? fileName : (editingEvent?.image ? "(Existing Image)" : "No file selected")}
									</Typography>
									<Button
										variant="contained"
										component="label"
										size="small"
										sx={{ bgcolor: '#d4af37', color: 'black', '&:hover': { bgcolor: '#b4941f' } }}
									>
										Upload
										<input
											type="file"
											name="image"
											hidden
											accept="image/*"
											onChange={(e) => {
												if (e.target.files && e.target.files[0]) {
													setFileName(e.target.files[0].name);
												}
											}}
										/>
									</Button>
								</Box>
								<Typography variant="caption" sx={{ color: '#666', ml: 1.5 }}>
									{t('form.imageHelper') || "Upload an image (JPG/PNG)"}
								</Typography>
							</Box>
						</Box>

						{/* Descriptions */}
						<Typography variant="subtitle2" sx={{ color: '#888', mt: 1 }}>{t('form.descriptions')}</Typography>
						<TextField name="descriptionFr" defaultValue={editingEvent?.descriptionFr || ''} label={t('form.descFr')} fullWidth multiline rows={2} variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ textarea: { color: 'white' }, fieldset: { borderColor: '#444' } }} />
						<TextField name="descriptionEn" defaultValue={editingEvent?.descriptionEn || ''} label={t('form.descEn')} fullWidth multiline rows={2} variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ textarea: { color: 'white' }, fieldset: { borderColor: '#444' } }} />
						<TextField name="descriptionPt" defaultValue={editingEvent?.descriptionPt || ''} label={t('form.descPt')} fullWidth multiline rows={2} variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ textarea: { color: 'white' }, fieldset: { borderColor: '#444' } }} />

					</DialogContent>
					<DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
						<Button onClick={handleClose} sx={{ color: '#888' }}>{t('dialog.cancel')}</Button>
						<Button type="submit" variant="contained" sx={{ bgcolor: '#d4af37', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#b4941f' } }}>{editingEvent ? t('dialog.update') : t('addEvent')}</Button>
					</DialogActions>
				</form>
			</Dialog>
		</Box>
	);
}
