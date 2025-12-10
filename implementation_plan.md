# Adding Packs to Reservation System

## User Review Required
> [!IMPORTANT]
> This change involves a database migration. Ensure the database is backed up if this were production (currently using `dev.db`).

## Proposed Changes

### Database (`backend/prisma/schema.prisma`)
- Add `packId` (Int, optional) to `Reservation` model.
- Add relation `pack Pack? @relation(fields: [packId], references: [id])`.

### Backend (`backend/server.ts`)
#### [MODIFY] [server.ts](file:///Users/youcef/Projects/huqqapraia/backend/server.ts)
- Update `POST /api/reservations` to accept `packId` in the body.
- Update `GET /api/reservations` to include the `pack` relation (e.g., `include: { pack: true }`).

### Frontend
#### [MODIFY] [ReservationPage.tsx](file:///Users/youcef/Projects/huqqapraia/frontend/app/[locale]/reservation/page.tsx)
- Fetch available packs on mount (`/api/packs`).
- Add a new form field (e.g., `<FormControl>` with `<Select>` or `<RadioGroup>`) to select a Pack.
- Display `titleFr`/`titleEn`/`titlePt` and `price`.
- Send `packId` in `handleSubmit`.

#### [MODIFY] [ReservationsTable.tsx](file:///Users/youcef/Projects/huqqapraia/frontend/components/Admin/ReservationsTable.tsx)
- Update table columns to display the selected Pack name.

#### [MODIFY] [en.json](file:///Users/youcef/Projects/huqqapraia/frontend/messages/en.json) (and fr.json, pt.json)
- Add translation keys for "Select Pack", "Pack", "Price", "No Pack Selected".

### [Deployment Migration]
#### [MODIFY] [schema.prisma](file:///Users/youcef/Projects/huqqapraia/backend/prisma/schema.prisma)
#### [NEW] [frontend/app/api/login/route.ts](file:///Users/youcef/Projects/huqqapraia/frontend/app/api/login/route.ts)
#### [NEW] [frontend/app/api/contact/route.ts](file:///Users/youcef/Projects/huqqapraia/frontend/app/api/contact/route.ts)
#### [NEW] [frontend/app/api/menu/route.ts](file:///Users/youcef/Projects/huqqapraia/frontend/app/api/menu/route.ts)
#### [NEW] [frontend/app/api/events/route.ts](file:///Users/youcef/Projects/huqqapraia/frontend/app/api/events/route.ts)
#### [NEW] [frontend/app/api/reservations/route.ts](file:///Users/youcef/Projects/huqqapraia/frontend/app/api/reservations/route.ts)
#### [NEW] [frontend/app/api/hero/route.ts](file:///Users/youcef/Projects/huqqapraia/frontend/app/api/hero/route.ts)
#### [DELETE] [backend/server.ts](file:///Users/youcef/Projects/huqqapraia/backend/server.ts)

## Verification Plan
### Automated Tests
- Verify all API endpoints return 200 via `curl`.
- Test dashboard/login flows with new API routes.
- Confirm database connection (Postgres) works.

### Manual Verification
1.  **Frontend**: Go to `/reservation`. Verify the "Select Pack" field appears and lists packs with prices.
2.  **Submission**: Create a reservation with a selected pack. Verify success message.
3.  **Database/Admin**: Go to `/dashboard`. Verify the new reservation appears in the table with the correct Pack name.
4.  **Optional**: Create a reservation *without* a pack to ensure it's optional.
