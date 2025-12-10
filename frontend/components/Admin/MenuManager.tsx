'use client';

import { useState } from 'react';
import {
	Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
	Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl, IconButton,
	TablePagination, InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { createMenuItem, deleteMenuItem, updateMenuItem } from '@/app/actions';
import { useTranslations } from 'next-intl';

export default function MenuManager({ menuItems }: { menuItems: any[] }) {
	const t = useTranslations('Admin.MenuManager');
	const [open, setOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<any | null>(null);
	const [itemToDelete, setItemToDelete] = useState<number | null>(null);

	// Pagination & Search
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState('');

	const handleClickOpen = (item?: any) => {
		setEditingItem(item || null);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setEditingItem(null);
	};

	const handleDeleteClick = (id: number) => {
		setItemToDelete(id);
		setDeleteOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (itemToDelete) {
			await deleteMenuItem(itemToDelete);
		}
		setDeleteOpen(false);
		setItemToDelete(null);
	};

	const handleDeleteCancel = () => {
		setDeleteOpen(false);
		setItemToDelete(null);
	};

	// Filter
	const filteredItems = menuItems.filter(item =>
		item.nameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
		item.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Pagination
	const displayedItems = filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
						{t('addItem')}
					</Button>
				</Box>
			</Box>

			<TableContainer component={Paper} sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 0 }}>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: '#000' }}>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('tableHeaders.nameFr')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('tableHeaders.category')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('tableHeaders.subcategory')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('tableHeaders.price')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold' }}>{t('tableHeaders.status')}</TableCell>
							<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 'bold', width: 100 }}>{t('tableHeaders.actions')}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{displayedItems.map((item) => (
							<TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell sx={{ color: 'white', borderBottom: '1px solid #222' }}>{item.nameFr}</TableCell>
								<TableCell sx={{ color: 'white', borderBottom: '1px solid #222' }}>{item.category}</TableCell>
								<TableCell sx={{ color: 'white', borderBottom: '1px solid #222' }}>{item.subcategory || '-'}</TableCell>
								<TableCell sx={{ color: '#d4af37', borderBottom: '1px solid #222' }}>{item.price} CVE</TableCell>
								<TableCell sx={{ color: item.available ? 'lightgreen' : 'gray', borderBottom: '1px solid #222' }}>{item.available ? t('status.available') : t('status.unavailable')}</TableCell>
								<TableCell sx={{ borderBottom: '1px solid #222' }}>
									<Box sx={{ display: 'flex' }}>
										<IconButton onClick={() => handleClickOpen(item)} sx={{ color: '#aaa', '&:hover': { color: '#d4af37' } }}>
											<EditIcon />
										</IconButton>
										<IconButton onClick={() => handleDeleteClick(item.id)} sx={{ color: '#d32f2f', '&:hover': { color: '#ffcdd2' } }}>
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
				count={filteredItems.length}
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
				<form key={editingItem ? editingItem.id : 'new'} action={async (formData) => {
					if (editingItem) {
						await updateMenuItem(editingItem.id, formData);
					} else {
						await createMenuItem(formData);
					}
					handleClose();
				}}>
					<DialogTitle sx={{ color: '#d4af37', borderBottom: '1px solid #333', fontWeight: 600 }}>{editingItem ? t('dialog.editItem') : t('dialog.addItemTitle')}</DialogTitle>
					<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>

						{/* Names */}
						<Typography variant="subtitle2" sx={{ color: '#888', mt: 1 }}>{t('form.names')}</Typography>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<TextField autoFocus name="nameFr" defaultValue={editingItem?.nameFr || ''} label={t('form.frenchReq')} fullWidth required variant="outlined"
								InputLabelProps={{ style: { color: '#888' } }}
								sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
							/>
							<TextField name="nameEn" defaultValue={editingItem?.nameEn || ''} label={t('form.english')} fullWidth variant="outlined"
								InputLabelProps={{ style: { color: '#888' } }}
								sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
							/>
							<TextField name="namePt" defaultValue={editingItem?.namePt || ''} label={t('form.portuguese')} fullWidth variant="outlined"
								InputLabelProps={{ style: { color: '#888' } }}
								sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
							/>
						</Box>

						{/* Descriptions */}
						<Typography variant="subtitle2" sx={{ color: '#888', mt: 1 }}>{t('form.descriptions')}</Typography>
						<TextField name="descriptionFr" defaultValue={editingItem?.descriptionFr || ''} label={t('form.descFr')} fullWidth multiline rows={2} variant="outlined"
							InputLabelProps={{ style: { color: '#888' } }}
							sx={{ textarea: { color: 'white' }, fieldset: { borderColor: '#444' } }}
						/>
						<TextField name="descriptionEn" defaultValue={editingItem?.descriptionEn || ''} label={t('form.descEn')} fullWidth multiline rows={2} variant="outlined"
							InputLabelProps={{ style: { color: '#888' } }}
							sx={{ textarea: { color: 'white' }, fieldset: { borderColor: '#444' } }}
						/>
						<TextField name="descriptionPt" defaultValue={editingItem?.descriptionPt || ''} label={t('form.descPt')} fullWidth multiline rows={2} variant="outlined"
							InputLabelProps={{ style: { color: '#888' } }}
							sx={{ textarea: { color: 'white' }, fieldset: { borderColor: '#444' } }}
						/>

						{/* Details */}
						<Typography variant="subtitle2" sx={{ color: '#888', mt: 1 }}>{t('form.details')}</Typography>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<TextField
								name="price"
								label={t('form.priceCve')}
								type="number"
								defaultValue={editingItem?.price || ''}
								fullWidth
								required
								variant="outlined"
								InputLabelProps={{ style: { color: '#888' } }}
								sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
							/>
							<FormControl fullWidth sx={{ fieldset: { borderColor: '#444' } }}>
								<InputLabel sx={{ color: '#888' }}>{t('form.category')}</InputLabel>
								<Select
									name="category"
									defaultValue={editingItem?.category || 'FOOD'}
									label={t('form.category')}
									sx={{ color: 'white', '.MuiSvgIcon-root': { color: '#d4af37' } }}
								>
									<MenuItem value="FOOD">{t('form.food')}</MenuItem>
									<MenuItem value="DRINK">{t('form.drink')}</MenuItem>
									<MenuItem value="HOOKAH">{t('form.hookah')}</MenuItem>
								</Select>
							</FormControl>
							<TextField
								name="subcategory"
								label={t('form.subcategory')}
								defaultValue={editingItem?.subcategory || ''}
								fullWidth
								variant="outlined"
								InputLabelProps={{ style: { color: '#888' } }}
								sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
							/>
						</Box>

						{editingItem && (
							<FormControl fullWidth sx={{ mt: 1 }}>
								<InputLabel sx={{ color: '#888' }}>{t('form.availability')}</InputLabel>
								<Select
									name="available"
									defaultValue={editingItem.available ? 'true' : 'false'}
									label={t('form.availability')}
									sx={{ color: 'white', '.MuiSvgIcon-root': { color: '#d4af37' }, fieldset: { borderColor: '#444' } }}
								>
									<MenuItem value="true">{t('status.available')}</MenuItem>
									<MenuItem value="false">{t('status.unavailable')}</MenuItem>
								</Select>
							</FormControl>
						)}

					</DialogContent>
					<DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
						<Button onClick={handleClose} sx={{ color: '#888' }}>{t('dialog.cancel')}</Button>
						<Button type="submit" variant="contained" sx={{ bgcolor: '#d4af37', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#b4941f' } }}>{editingItem ? t('dialog.update') : t('addItem')}</Button>
					</DialogActions>
				</form>
			</Dialog>
		</Box>
	);
}
