import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { sendReservationNotification } from './services/emailService';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
	? process.env.ALLOWED_ORIGINS.split(',')
	: [
		'http://localhost:3000',
		'http://localhost:3001'
	];

app.use(cors({
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);

		if (allowedOrigins.indexOf(origin) !== -1) {
			return callback(null, true);
		}

		// Check for Vercel preview deployments
		// Matches https://huqqa-praia-front-*-youcefcs-projects.vercel.app
		const vercelPreviewPattern = /^https:\/\/huqqa-praia-front-.*-youcefcs-projects\.vercel\.app$/;
		if (vercelPreviewPattern.test(origin)) {
			return callback(null, true);
		}

		callback(new Error('Not allowed by CORS'));
	},
	credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Increased limit for video uploads

// Health Check
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


// Hero Config
app.get('/api/hero', async (req, res) => {
	try {
		const config = await prisma.heroConfig.findFirst();
		res.json(config || {});
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch hero config' });
	}
});

app.post('/api/hero', async (req, res) => {
	try {
		const { videoUrl } = req.body;
		// Upsert logic: Update first if exists, else create
		const existing = await prisma.heroConfig.findFirst();
		if (existing) {
			const updated = await prisma.heroConfig.update({
				where: { id: existing.id },
				data: { videoUrl }
			});
			res.json(updated);
		} else {
			const created = await prisma.heroConfig.create({
				data: { videoUrl }
			});
			res.json(created);
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to update hero config' });
	}
});

// Reservations
app.get('/api/reservations', async (req, res) => {
	try {
		const reservations = await prisma.reservation.findMany({
			orderBy: { createdAt: 'desc' },
			include: { pack: true }
		});
		res.json(reservations);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch reservations' });
	}
});

app.post('/api/reservations', async (req, res) => {
	try {
		const { name, email, phone, guests, date, packId } = req.body;
		const guestsInt = parseInt(guests);
		const reservationDate = new Date(date);

		// 1. Calculate guest count for the specific DATE (YYYY-MM-DD)
		// We need to filter by the day, ignoring time.
		const dayStart = new Date(reservationDate);
		dayStart.setHours(0, 0, 0, 0);
		const dayEnd = new Date(reservationDate);
		dayEnd.setHours(23, 59, 59, 999);

		const dailyReservations = await prisma.reservation.findMany({
			where: {
				date: {
					gte: dayStart,
					lte: dayEnd
				},
				status: { not: 'CANCELLED' }
			}
		});

		const currentGuestCount = dailyReservations.reduce((sum, res) => sum + res.guests, 0);

		if (currentGuestCount + guestsInt > 50) {
			return res.status(400).json({
				error: 'Daily capacity reached',
				message: `Only ${50 - currentGuestCount} spots left for this date.`
			});
		}

		const data: any = {
			name, email, phone,
			guests: guestsInt,
			date: reservationDate,
			status: 'PENDING'
		};

		if (packId) {
			data.pack = { connect: { id: parseInt(packId) } };
		}


		console.log("[DEBUG] creating reservation with data:", data);
		const newReservation = await prisma.reservation.create({
			data,
			include: { pack: true }
		});
		console.log("[DEBUG] reservation created id:", newReservation.id);

		// Send Email Notification
		try {
			const contactInfo = await prisma.contactInfo.findFirst();
			console.log("[DEBUG] contactInfo found:", contactInfo ? "YES" : "NO", contactInfo?.email);

			if (contactInfo && contactInfo.email) {
				await sendReservationNotification(contactInfo.email, {
					name,
					email,
					phone,
					guests: guestsInt,
					date: reservationDate,
					packName: newReservation.pack?.titleEn || newReservation.pack?.titleFr
				});
			}
		} catch (emailErr) {
			console.error("Failed to trigger email notification:", emailErr);
		}

		res.json(newReservation);
	} catch (error) {
		console.error(error); // Log for debug
		res.status(500).json({ error: 'Failed to create reservation' });
	}
});

app.put('/api/reservations/:id/status', async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		const reservation = await prisma.reservation.update({
			where: { id: parseInt(id) },
			data: { status }
		});
		res.json(reservation);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update reservation' });
	}
});

// Menu CRUD
app.get('/api/menu', async (req, res) => {
	try {
		const items = await prisma.menuItem.findMany({
			where: { available: true }
		});
		res.json(items);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch menu' });
	}
});

app.post('/api/menu', async (req, res) => {
	try {
		const item = await prisma.menuItem.create({
			data: req.body
		});
		res.json(item);
	} catch (error) {
		res.status(500).json({ error: 'Failed to create menu item' });
	}
});

app.put('/api/menu/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const item = await prisma.menuItem.update({
			where: { id: parseInt(id) },
			data: req.body
		});
		res.json(item);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update menu item' });
	}
});

app.delete('/api/menu/:id', async (req, res) => {
	try {
		const { id } = req.params;
		await prisma.menuItem.delete({
			where: { id: parseInt(id) }
		});
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete menu item' });
	}
});

// Events CRUD
app.get('/api/events', async (req, res) => {
	try {
		const events = await prisma.event.findMany({
			orderBy: { date: 'asc' }
		});
		res.json(events);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch events' });
	}
});

app.post('/api/events', async (req, res) => {
	try {
		const { titleFr, titleEn, titlePt, date, descriptionFr, descriptionEn, descriptionPt, image } = req.body;
		const event = await prisma.event.create({
			data: {
				titleFr,
				titleEn: titleEn || titleFr,
				titlePt: titlePt || titleFr,
				date: new Date(date),
				descriptionFr,
				descriptionEn,
				descriptionPt,
				image
			}
		});
		res.json(event);
	} catch (error) {
		res.status(500).json({ error: 'Failed to create event' });
	}
});

app.put('/api/events/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { titleFr, titleEn, titlePt, date, descriptionFr, descriptionEn, descriptionPt, image } = req.body;
		const event = await prisma.event.update({
			where: { id: parseInt(id) },
			data: {
				titleFr,
				titleEn,
				titlePt,
				date: new Date(date),
				descriptionFr,
				descriptionEn,
				descriptionPt,
				image
			}
		});
		res.json(event);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update event' });
	}
});

app.delete('/api/events/:id', async (req, res) => {
	try {
		const { id } = req.params;
		await prisma.event.delete({
			where: { id: parseInt(id) }
		});
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete event' });
	}
});

// Packs CRUD
app.get('/api/packs', async (req, res) => {
	try {
		const packs = await prisma.pack.findMany();
		res.json(packs);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch packs' });
	}
});

app.post('/api/packs', async (req, res) => {
	try {
		const pack = await prisma.pack.create({
			data: req.body
		});
		res.json(pack);
	} catch (error) {
		res.status(500).json({ error: 'Failed to create pack' });
	}
});

app.put('/api/packs/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const pack = await prisma.pack.update({
			where: { id: parseInt(id) },
			data: req.body
		});
		res.json(pack);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update pack' });
	}
});

app.delete('/api/packs/:id', async (req, res) => {
	try {
		const { id } = req.params;
		await prisma.pack.delete({
			where: { id: parseInt(id) }
		});
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete pack' });
	}
});

// --- Contact Info Endpoints ---

app.get('/api/contact', async (req, res) => {
	try {
		let contact = await prisma.contactInfo.findFirst();
		if (!contact) {
			// Create default if not exists
			contact = await prisma.contactInfo.create({
				data: {
					address: "Praia, Cape Verde",
					email: "info@huqqapraia.com",
					phone: "+238 999 99 99",
					mapsUrl: ""
				}
			});
		}
		res.json(contact);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch contact info' });
	}
});

app.post('/api/contact', async (req, res) => {
	try {
		const { address, email, phone, mapsUrl, instagram, facebook, whatsapp } = req.body;
		let contact = await prisma.contactInfo.findFirst();

		if (contact) {
			contact = await prisma.contactInfo.update({
				where: { id: contact.id },
				data: { address, email, phone, mapsUrl, instagram, facebook, whatsapp }
			});
		} else {
			contact = await prisma.contactInfo.create({
				data: { address, email, phone, mapsUrl, instagram, facebook, whatsapp }
			});
		}
		res.json(contact);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to update contact info' });
	}
});

app.post('/api/login', async (req, res) => {
	try {
		const { password } = req.body;
		const admin = await prisma.admin.findFirst();

		if (!admin) {
			return res.status(401).json({ error: 'No admin configured' });
		}

		if (admin.password === password) {
			res.json({ success: true });
		} else {
			res.status(401).json({ error: 'Invalid password' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
