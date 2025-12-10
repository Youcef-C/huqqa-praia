# Huqqa Praia Reservation & Menu System

A comprehensive web application for managing reservations, menus, events, and packs for Huqqa Praia. The system consists of a Next.js frontend and a Node.js/Express backend with Prisma and SQLite.

## Project Structure

- **frontend/**: Next.js 15 application using Material UI, Next-Intl (i18n), and Swiper.
- **backend/**: Node.js Express server with Prisma ORM and SQLite database.

## Features

- **Public Site**:
  - Multilingual support (English, French, Portuguese).
  - Dynamic content for Menu, Events, and Packs.
  - Reservation system with email notifications (simulated).
  - "The Place" showcase page.
  - Dynamic Homepage with Hero Video and Events Carousel.

- **Admin Dashboard** (Protected):
  - Dashboard overview.
  - **Reservations Manager**: View, filter, and manage reservation status.
  - **Menu Manager**: CRUD operations for menu items (Food, Drinks, Shisha).
  - **Events Manager**: Manage upcoming events (multilingual support).
  - **Packs Manager**: Create and manage special offers/packs.
  - **Hero Manager**: Update the homepage background video.
  - **Contact Manager**: Update footer address, social links, and map.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database and seed data:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
   *Note: Default admin password is seeded as `adbztao19269`.*

4. Start the server:
   ```bash
   npm run dev
   ```
   The backend runs on `http://localhost:4000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend runs on `http://localhost:3000`.

## Admin Access

- Access the dashboard via the hidden link in the footer or navigate to `/login`.
- **Password**: `adbztao19269`

## Technologies

- **Frontend**: Next.js, React, Material UI, TypeScript, Next-Intl, Swiper, JS-Cookie.
- **Backend**: Node.js, Express, Prisma, SQLite, TypeScript, Multer (file uploads).
