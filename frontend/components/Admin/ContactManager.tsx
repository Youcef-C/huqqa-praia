'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslations } from 'next-intl';

export default function ContactManager() {
	// Using hardcoded strings for now as we haven't added translations for this specific component yet
	// but keeping structure clean.

	const [address, setAddress] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [mapsUrl, setMapsUrl] = useState('');
	const [instagram, setInstagram] = useState('');
	const [facebook, setFacebook] = useState('');
	const [whatsapp, setWhatsapp] = useState('');
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

	useEffect(() => {
		fetch('http://localhost:4000/api/contact')
			.then(res => res.json())
			.then(data => {
				if (data) {
					setAddress(data.address || '');
					setEmail(data.email || '');
					setPhone(data.phone || '');
					setMapsUrl(data.mapsUrl || '');
					setInstagram(data.instagram || '');
					setFacebook(data.facebook || '');
					setWhatsapp(data.whatsapp || '');
				}
				setLoading(false);
			})
			.catch(err => {
				console.error(err);
				setLoading(false);
			});
	}, []);

	const handleSave = async () => {
		try {
			const res = await fetch('http://localhost:4000/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ address, email, phone, mapsUrl, instagram, facebook, whatsapp })
			});

			if (res.ok) {
				setMessage({ type: 'success', text: 'Contact info updated successfully!' });
			} else {
				setMessage({ type: 'error', text: 'Failed to update contact info.' });
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'An error occurred.' });
		}
	};

	if (loading) return <Typography sx={{ color: 'white' }}>Loading...</Typography>;

	return (
		<Paper sx={{ p: 4, bgcolor: '#121212', border: '1px solid #333', borderRadius: 0, mt: 4 }}>
			<Typography variant="h5" sx={{ color: '#d4af37', mb: 3, fontWeight: 600, textTransform: 'uppercase' }}>
				Contact Information
			</Typography>

			{message && (
				<Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
					{message.text}
				</Alert>
			)}

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
				<TextField
					label="Address"
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					fullWidth
					variant="outlined"
					InputLabelProps={{ style: { color: '#888' } }}
					sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
				/>
				<TextField
					label="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					fullWidth
					variant="outlined"
					InputLabelProps={{ style: { color: '#888' } }}
					sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
				/>
				<TextField
					label="Phone (WhatsApp)"
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					fullWidth
					variant="outlined"
					InputLabelProps={{ style: { color: '#888' } }}
					sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
				/>
				<TextField
					label="Google Maps Embed URL (src attribute)"
					value={mapsUrl}
					onChange={(e) => setMapsUrl(e.target.value)}
					fullWidth
					variant="outlined"
					helperText="Paste the 'src' link from the Google Maps iframe embed code."
					InputLabelProps={{ style: { color: '#888' } }}
					FormHelperTextProps={{ style: { color: '#666' } }}
					sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
				/>

				<Box sx={{ borderTop: '1px solid #333', my: 2 }} />
				<Typography variant="h6" sx={{ color: '#d4af37', textTransform: 'uppercase' }}>Social Media</Typography>

				<TextField
					label="Instagram URL"
					value={instagram}
					onChange={(e) => setInstagram(e.target.value)}
					fullWidth
					variant="outlined"
					InputLabelProps={{ style: { color: '#888' } }}
					sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
				/>
				<TextField
					label="Facebook URL"
					value={facebook}
					onChange={(e) => setFacebook(e.target.value)}
					fullWidth
					variant="outlined"
					InputLabelProps={{ style: { color: '#888' } }}
					sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
				/>
				<TextField
					label="WhatsApp Number/URL"
					value={whatsapp}
					onChange={(e) => setWhatsapp(e.target.value)}
					fullWidth
					variant="outlined"
					InputLabelProps={{ style: { color: '#888' } }}
					sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
				/>

				<Button
					variant="contained"
					onClick={handleSave}
					startIcon={<SaveIcon />}
					sx={{
						alignSelf: 'flex-start',
						bgcolor: '#d4af37',
						color: 'black',
						fontWeight: 'bold',
						'&:hover': { bgcolor: '#b4941f' }
					}}
				>
					Save Changes
				</Button>
			</Box>
		</Paper>
	);
}
