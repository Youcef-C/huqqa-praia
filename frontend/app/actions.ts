'use server';

import { revalidatePath } from 'next/cache';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api`;

export async function createReservation(formData: FormData) {
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const phone = formData.get('phone') as string;
	const guests = parseInt(formData.get('guests') as string);
	const dateStr = formData.get('date') as string; // Expect ISO string

	if (!name || !email || !dateStr) {
		throw new Error('Missing fields');
	}

	await fetch(`${API_URL}/reservations`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name,
			email,
			phone,
			guests,
			date: dateStr
		})
	});

	revalidatePath('/dashboard');
}

export async function updateReservationStatus(id: number, status: string) {
	await fetch(`${API_URL}/reservations/${id}/status`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ status })
	});
	revalidatePath('/dashboard');
}

export async function createMenuItem(formData: FormData) {
	const nameFr = formData.get('nameFr') as string;
	const nameEn = formData.get('nameEn') as string;
	const namePt = formData.get('namePt') as string;
	const descriptionFr = formData.get('descriptionFr') as string;
	const descriptionEn = formData.get('descriptionEn') as string;
	const descriptionPt = formData.get('descriptionPt') as string;
	const price = parseFloat(formData.get('price') as string);
	const category = formData.get('category') as string;

	await fetch(`${API_URL}/menu`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			nameFr,
			nameEn: nameEn || nameFr,
			namePt: namePt || nameFr,
			descriptionFr,
			descriptionEn,
			descriptionPt,
			price,
			category: category || 'FOOD',
			available: true
		})
	});
	revalidatePath('/menu');
	revalidatePath('/dashboard');
}

// ... existing createMenuItem ...

export async function deleteMenuItem(id: number) {
	await fetch(`${API_URL}/menu/${id}`, { method: 'DELETE' });
	revalidatePath('/menu');
	revalidatePath('/dashboard');
}

export async function updateMenuItem(id: number, formData: FormData) {
	const nameFr = formData.get('nameFr') as string;
	const nameEn = formData.get('nameEn') as string;
	const namePt = formData.get('namePt') as string;
	const descriptionFr = formData.get('descriptionFr') as string;
	const descriptionEn = formData.get('descriptionEn') as string;
	const descriptionPt = formData.get('descriptionPt') as string;
	const price = parseFloat(formData.get('price') as string);
	const category = formData.get('category') as string;
	const available = formData.get('available') === 'true';

	await fetch(`${API_URL}/menu/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			nameFr, nameEn, namePt,
			descriptionFr, descriptionEn, descriptionPt,
			price, category, available
		})
	});
	revalidatePath('/menu');
	revalidatePath('/dashboard');
}

// ... existing login/logout ...

export async function createEvent(formData: FormData) {
	const titleFr = formData.get('titleFr') as string;
	const titleEn = formData.get('titleEn') as string;
	const titlePt = formData.get('titlePt') as string;
	const descriptionFr = formData.get('descriptionFr') as string;
	const descriptionEn = formData.get('descriptionEn') as string;
	const descriptionPt = formData.get('descriptionPt') as string;
	const date = formData.get('date') as string;
	const imageFile = formData.get('image') as File;

	let image = '';
	if (imageFile && imageFile.size > 0) {
		const buffer = Buffer.from(await imageFile.arrayBuffer());
		image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
	}

	await fetch(`${API_URL}/events`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			titleFr, titleEn, titlePt,
			date,
			descriptionFr, descriptionEn, descriptionPt,
			image
		})
	});
	revalidatePath('/');
	revalidatePath('/dashboard');
}

export async function deleteEvent(id: number) {
	await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
	revalidatePath('/');
	revalidatePath('/dashboard');
}

export async function updateEvent(id: number, formData: FormData) {
	const titleFr = formData.get('titleFr') as string;
	const titleEn = formData.get('titleEn') as string;
	const titlePt = formData.get('titlePt') as string;
	const descriptionFr = formData.get('descriptionFr') as string;
	const descriptionEn = formData.get('descriptionEn') as string;
	const descriptionPt = formData.get('descriptionPt') as string;
	const date = formData.get('date') as string;
	const imageFile = formData.get('image') as File;

	const payload: any = {
		titleFr, titleEn, titlePt,
		date,
		descriptionFr, descriptionEn, descriptionPt
	};

	if (imageFile && imageFile.size > 0) {
		const buffer = Buffer.from(await imageFile.arrayBuffer());
		payload.image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
	}

	await fetch(`${API_URL}/events/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	revalidatePath('/');
	revalidatePath('/dashboard');
}

export async function createPack(formData: FormData) {
	const titleFr = formData.get('titleFr') as string;
	const titleEn = formData.get('titleEn') as string;
	const titlePt = formData.get('titlePt') as string;
	const recommendedFor = formData.get('recommendedFor') as string;
	const price = formData.get('price') as string;
	const itemsFr = formData.get('itemsFr') as string; // Expects JSON string or newline sep
	const itemsEn = formData.get('itemsEn') as string;
	const itemsPt = formData.get('itemsPt') as string;

	await fetch(`${API_URL}/packs`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			titleFr, titleEn, titlePt,
			recommendedFor, price,
			itemsFr, itemsEn, itemsPt
		})
	});
	revalidatePath('/packs');
	revalidatePath('/dashboard');
}

export async function deletePack(id: number) {
	await fetch(`${API_URL}/packs/${id}`, { method: 'DELETE' });
	revalidatePath('/packs');
	revalidatePath('/dashboard');
}

export async function updatePack(id: number, formData: FormData) {
	const titleFr = formData.get('titleFr') as string;
	const titleEn = formData.get('titleEn') as string;
	const titlePt = formData.get('titlePt') as string;
	const recommendedFor = formData.get('recommendedFor') as string;
	const price = formData.get('price') as string;
	const itemsFr = formData.get('itemsFr') as string;
	const itemsEn = formData.get('itemsEn') as string;
	const itemsPt = formData.get('itemsPt') as string;

	await fetch(`${API_URL}/packs/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			titleFr, titleEn, titlePt,
			recommendedFor, price,
			itemsFr, itemsEn, itemsPt
		})
	});
	revalidatePath('/packs');
	revalidatePath('/dashboard');
}

export async function updateHeroConfig(formData: FormData) {
	const videoFile = formData.get('video') as File;

	let videoUrl = '';
	if (videoFile && videoFile.size > 0) {
		const buffer = Buffer.from(await videoFile.arrayBuffer());
		videoUrl = `data:${videoFile.type};base64,${buffer.toString('base64')}`;
	}

	if (!videoUrl) return; // Do nothing if field empty? Or allow clearing?
	// If user wants to clear, they might need a explicit 'clear' flag, but for now we assume upload-to-update.

	await fetch(`${API_URL}/hero`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ videoUrl })
	});
	revalidatePath('/');
	revalidatePath('/dashboard');
}
