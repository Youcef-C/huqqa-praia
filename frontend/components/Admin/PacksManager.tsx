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
import { createPack, deletePack, updatePack } from '@/app/actions';
import { useTranslations } from 'next-intl';

export default function PacksManager({ packs }: { packs: any[] }) {
	const t = useTranslations('Admin.PacksManager');
	const [open, setOpen] = useState(false);
	const [editingPack, setEditingPack] = useState<any | null>(null);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [packToDelete, setPackToDelete] = useState<number | null>(null);

	// Pagination & Search
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState('');

	const handleClickOpen = (pack?: any) => {
		setEditingPack(pack || null);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setEditingPack(null);
	};

	const handleDeleteClick = (id: number) => {
		setPackToDelete(id);
		setDeleteOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (packToDelete) {
			await deletePack(packToDelete);
		}
		setDeleteOpen(false);
		setPackToDelete(null);
	};

	const handleDeleteCancel = () => {
		setDeleteOpen(false);
		setPackToDelete(null);
	};

	// Filter
	const filteredPacks = packs.filter(pack =>
		pack.titleFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
		pack.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Pagination
	const displayedPacks = filteredPacks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
						{t('addPack')}
					</Button>
				</Box>
			</Box>

			<TableContainer component={Paper} sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 0 }}>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: '#000' }}>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('tableHeaders.titleFr')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('tableHeaders.recommended')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('tableHeaders.price')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold', width: 100 }}>{t('tableHeaders.actions')}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{displayedPacks.map((pack) => (
							<TableRow key={pack.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell sx={{ color: 'white', borderBottom: '1px solid #222' }}>{pack.titleFr}</TableCell>
								<TableCell sx={{ color: 'white', borderBottom: '1px solid #222' }}>{pack.recommendedFor}</TableCell>
								<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #222' }}>{pack.price}</TableCell>
								<TableCell sx={{ borderBottom: '1px solid #222' }}>
									<Box sx={{ display: 'flex' }}>
										<IconButton onClick={() => handleClickOpen(pack)} sx={{ color: '#aaa', '&:hover': { color: '#d4af37' } }}>
											<EditIcon />
										</IconButton>
										<IconButton onClick={() => handleDeleteClick(pack.id)} sx={{ color: '#d32f2f', '&:hover': { color: '#ffcdd2' } }}>
											<DeleteIcon />
										</IconButton>
									</Box>
								</TableCell>
							</TableRow>
						))}
						{packs.length === 0 && (
							<TableRow>
								<TableCell colSpan={4} align="center" sx={{ color: '#aaa', py: 4 }}>{t('noPacks')}</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={filteredPacks.length}
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
				maxWidth="md"
				fullWidth
				PaperProps={{
					sx: {
						bgcolor: '#121212',
						border: '1px solid #d4af37',
						borderRadius: 0,
						color: 'white'
					}
				}}
			>
				<form action={async (formData) => {
					if (editingPack) {
						await updatePack(editingPack.id, formData);
					} else {
						await createPack(formData);
					}
					handleClose();
				}}>
					<DialogTitle sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 600 }}>{editingPack ? t('dialog.editPack') : t('dialog.addPackTitle')}</DialogTitle>
					<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>

						<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
							<TextField
								name="price"
								label={t('form.priceLabel')}
								defaultValue={editingPack?.price || ''}
								fullWidth
								required
								variant="outlined"
								InputLabelProps={{ style: { color: '#888' } }}
								sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
							/>
							<TextField
								name="recommendedFor"
								label={t('form.recommendedLabel')}
								defaultValue={editingPack?.recommendedFor || ''}
								fullWidth
								required
								variant="outlined"
								InputLabelProps={{ style: { color: '#888' } }}
								sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
							/>
						</Box>

						<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
							<TextField name="titleFr" defaultValue={editingPack?.titleFr || ''} label={t('form.titleFr')} fullWidth required variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }} />
							<TextField name="titleEn" defaultValue={editingPack?.titleEn || ''} label={t('form.titleEn')} fullWidth variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }} />
							<TextField name="titlePt" defaultValue={editingPack?.titlePt || ''} label={t('form.titlePt')} fullWidth variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }} />
						</Box>

						<Typography variant="caption" sx={{ color: '#888' }}>
							{t('form.itemsHelper')}
						</Typography>
						<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
							<TextField name="itemsFr" defaultValue={editingPack?.itemsFr || ''} label={t('form.itemsFr')} fullWidth multiline rows={4} variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ textarea: { color: 'white' }, fieldset: { borderColor: '#444' } }} />
							<TextField name="itemsEn" defaultValue={editingPack?.itemsEn || ''} label={t('form.itemsEn')} fullWidth multiline rows={4} variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ textarea: { color: 'white' }, fieldset: { borderColor: '#444' } }} />
							<TextField name="itemsPt" defaultValue={editingPack?.itemsPt || ''} label={t('form.itemsPt')} fullWidth multiline rows={4} variant="outlined" InputLabelProps={{ style: { color: '#888' } }} sx={{ textarea: { color: 'white' }, fieldset: { borderColor: '#444' } }} />
						</Box>
					</DialogContent>
					<DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
						<Button onClick={handleClose} sx={{ color: '#888' }}>{t('dialog.cancel')}</Button>
						<Button type="submit" variant="contained" sx={{ bgcolor: '#d4af37', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#b4941f' } }}>{editingPack ? t('dialog.update') : t('dialog.add')}</Button>
					</DialogActions>
				</form>
			</Dialog>
		</Box>
	);
}
