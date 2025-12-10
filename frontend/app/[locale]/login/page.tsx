'use client';

import { useState, useEffect } from 'react';
import { Box, Container, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useRouter } from '@/i18n/routing';
import Cookies from 'js-cookie';

export default function LoginPage() {
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	useEffect(() => {
		if (Cookies.get('admin_session') === 'true') {
			router.push('/dashboard');
		}
	}, [router]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch('http://localhost:4000/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password })
			});

			if (res.ok) {
				Cookies.set('admin_session', 'true', { expires: 365, path: '/' });
				router.push('/dashboard');
			} else {
				const data = await res.json();
				setError(data.error || 'Invalid password');
			}
		} catch (err) {
			setError('Something went wrong');
		}
	};

	return (
		<Container maxWidth="sm" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Paper elevation={3} sx={{ p: 4, width: '100%', bgcolor: '#121212', border: '1px solid #333' }}>
				<Typography variant="h4" gutterBottom sx={{ color: '#d4af37', textAlign: 'center', mb: 3 }}>
					Admin Login
				</Typography>

				{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

				<form onSubmit={handleLogin}>
					<TextField
						fullWidth
						type="password"
						label="Password"
						variant="outlined"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						sx={{ mb: 3, input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
						InputLabelProps={{ style: { color: '#888' } }}
					/>
					<Button
						fullWidth
						type="submit"
						variant="contained"
						size="large"
						sx={{
							bgcolor: '#d4af37',
							color: 'black',
							fontWeight: 'bold',
							'&:hover': { bgcolor: '#b4941f' }
						}}
					>
						Access Dashboard
					</Button>
				</form>
			</Paper>
		</Container>
	);
}
