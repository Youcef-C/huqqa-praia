import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	// Clear existing data
	await prisma.menuItem.deleteMany()
	await prisma.event.deleteMany()
	await prisma.admin.deleteMany()

	// Seed Admin Password
	const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
	await prisma.admin.create({
		data: {
			password: adminPassword
		}
	})

	// Seed Menu Items
	const menuItems = [
		// HOOKAH
		{
			nameFr: 'Love 66',
			nameEn: 'Love 66',
			namePt: 'Love 66',
			descriptionFr: 'Mélange passionné de fruits tropicaux',
			descriptionEn: 'Passionate mix of tropical fruits',
			descriptionPt: 'Mistura apaixonada de frutas tropicais',
			price: 2200,
			category: 'HOOKAH',
			image: '/assets/shisha1.jpg',
		},
		{
			nameFr: 'Hawaii',
			nameEn: 'Hawaii',
			namePt: 'Hawaii',
			descriptionFr: 'Ananas, Mangue, Menthe',
			descriptionEn: 'Pineapple, Mango, Mint',
			descriptionPt: 'Abacaxi, Manga, Hortelã',
			price: 2200,
			category: 'HOOKAH',
			image: '/assets/shisha2.jpg',
		},
		{
			nameFr: 'Lady Killer',
			nameEn: 'Lady Killer',
			namePt: 'Lady Killer',
			descriptionFr: 'Melon, Mangue, Baies, Menthe',
			descriptionEn: 'Melon, Mango, Berries, Mint',
			descriptionPt: 'Melão, Manga, Frutas vermelhas, Hortelã',
			price: 2200,
			category: 'HOOKAH',
			image: '/assets/shisha1.jpg',
		},
		{
			nameFr: 'Mi Amor',
			nameEn: 'Mi Amor',
			namePt: 'Mi Amor',
			descriptionFr: 'Ananas, Banane, Menthe',
			descriptionEn: 'Pineapple, Banana, Mint',
			descriptionPt: 'Abacaxi, Banana, Hortelã',
			price: 2200,
			category: 'HOOKAH',
			image: '/assets/shisha2.jpg',
		},
		// DRINKS - MOCKTAILS
		{
			nameFr: 'Mojito Classic',
			nameEn: 'Classic Mojito',
			namePt: 'Mojito Clássico',
			descriptionFr: 'Citron vert, Menthe, Eau gazeuse (Sans Alcool)',
			descriptionEn: 'Lime, Mint, Sparkling water (Non-alcoholic)',
			descriptionPt: 'Lima, Hortelã, Água com gás (Sem álcool)',
			price: 1100,
			category: 'DRINK',
			image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
		},
		{
			nameFr: 'Pina Colada',
			nameEn: 'Pina Colada',
			namePt: 'Pina Colada',
			descriptionFr: 'Ananas, Coco, Crème (Sans Alcool)',
			descriptionEn: 'Pineapple, Coconut, Cream (Non-alcoholic)',
			descriptionPt: 'Abacaxi, Coco, Creme (Sem álcool)',
			price: 1100,
			category: 'DRINK',
			image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602',
		},
		{
			nameFr: 'Virgin Strawberry Mojito',
			nameEn: 'Virgin Strawberry Mojito',
			namePt: 'Mojito de Morango Virgem',
			descriptionFr: 'Fraise, Citron vert, Menthe',
			descriptionEn: 'Strawberry, Lime, Mint',
			descriptionPt: 'Morango, Lima, Hortelã',
			price: 1300,
			category: 'DRINK',
			image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
		},
		// FOOD
		{
			nameFr: 'Tacos Poulet',
			nameEn: 'Chicken Tacos',
			namePt: 'Tacos de Frango',
			descriptionFr: 'Poulet mariné, sauce fromagère, frites',
			descriptionEn: 'Marinated chicken, cheese sauce, fries',
			descriptionPt: 'Frango marinado, molho de queijo, batatas fritas',
			price: 1500,
			category: 'FOOD',
		},
		{
			nameFr: 'Burger Huqqa',
			nameEn: 'Huqqa Burger',
			namePt: 'Hambúrguer Huqqa',
			descriptionFr: 'Steak 180g, Cheddar, Oignons confits',
			descriptionEn: '180g Steak, Cheddar, Caramelized onions',
			descriptionPt: 'Bife 180g, Cheddar, Cebolas caramelizadas',
			price: 1800,
			category: 'FOOD',
		},
		{
			nameFr: 'Nachos Guacamole',
			nameEn: 'Guacamole Nachos',
			namePt: 'Nachos com Guacamole',
			descriptionFr: 'Chips de maïs, guacamole maison, salsa',
			descriptionEn: 'Corn chips, homemade guacamole, salsa',
			descriptionPt: 'Chips de milho, guacamole caseiro, salsa',
			price: 1300,
			category: 'FOOD',
		}
	]

	for (const item of menuItems) {
		await prisma.menuItem.create({
			data: item
		})
	}

	// Seed Events
	const events = [
		{
			titleFr: 'Soirée Latino',
			titleEn: 'Latino Night',
			titlePt: 'Noite Latina',
			date: new Date('2025-12-15T20:00:00Z'),
			image: 'A3 Huqqa Bagatelle - 1.png',
			descriptionFr: 'Ambiance caliente toute la nuit',
		},
		{
			titleFr: 'Afterwork Détente',
			titleEn: 'Chill Afterwork',
			titlePt: 'Afterwork Relaxante',
			date: new Date('2025-12-12T18:00:00Z'),
			image: 'Affiche A3 Événement Afterwork Bar Moderne Manuscrit Gris Noir - 3.png',
			descriptionFr: 'Cocktails à -50%',
		}
	]

	for (const event of events) {
		await prisma.event.create({
			data: event
		})
	}

	// Create Packs
	const packs = [
		{
			titleFr: "PACK EXCLUSIF HUQQA",
			titleEn: "HUQQA EXCLUSIVE PACK",
			titlePt: "PACK EXCLUSIVO HUQQA",
			itemsFr: JSON.stringify(["1 Bouteille (Vodka ou Whisky)", "1 Chicha (Au choix)"]),
			itemsEn: JSON.stringify(["1 Bottle (Vodka or Whisky)", "1 Shisha (Choice)"]),
			itemsPt: JSON.stringify(["1 Garrafa (Vodka ou Whisky)", "1 Shisha (Escolha)"]),
			price: "12,000 CVE",
			recommendedFor: "2 Personnes"
		},
		{
			titleFr: "PACK 4 PERSONNES",
			titleEn: "PACK 4 PEOPLE",
			titlePt: "PACK 4 PESSOAS",
			itemsFr: JSON.stringify(["2 Bouteilles (Vodka ou Whisky)", "2 Chichas (Au choix)"]),
			itemsEn: JSON.stringify(["2 Bottles (Vodka or Whisky)", "2 Shishas (Choice)"]),
			itemsPt: JSON.stringify(["2 Garrafas (Vodka ou Whisky)", "2 Shishas (Escolha)"]),
			price: "24,000 CVE",
			recommendedFor: "4 Personnes"
		},
		{
			titleFr: "PACK 6 PERSONNES",
			titleEn: "PACK 6 PEOPLE",
			titlePt: "PACK 6 PESSOAS",
			itemsFr: JSON.stringify(["3 Bouteilles (Vodka ou Whisky)", "3 Chichas (Au choix)"]),
			itemsEn: JSON.stringify(["3 Bottles (Vodka or Whisky)", "3 Shishas (Choice)"]),
			itemsPt: JSON.stringify(["3 Garrafas (Vodka ou Whisky)", "3 Shishas (Escolha)"]),
			price: "35,000 CVE",
			recommendedFor: "6 Personnes"
		},
		{
			titleFr: "PACK PREMIUM",
			titleEn: "PREMIUM PACK",
			titlePt: "PACK PREMIUM",
			itemsFr: JSON.stringify(["2 Bouteilles (Vodka ou Whisky)", "1 Bouteille (Champagne)", "3 Chichas (Au choix)"]),
			itemsEn: JSON.stringify(["2 Bottles (Vodka or Whisky)", "1 Bottle (Champagne)", "3 Shishas (Choice)"]),
			itemsPt: JSON.stringify(["2 Garrafas (Vodka ou Whisky)", "1 Garrafa (Champagne)", "3 Shishas (Escolha)"]),
			price: "50,000 CVE",
			recommendedFor: "VIP"
		}
	];

	for (const pack of packs) {
		await prisma.pack.create({ data: pack });
	}

	console.log('Seeding completed.')
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
