# CITK Sports Management System

This project is a React + Vite web application for managing sports item issue, return tracking, and inventory at Central Institute of Technology Kokrajhar (CITK).

## Project Summary

- Tracks issued sports items with student and return-date details
- Supports admin workflows for issuing, returning, and inventory updates
- Allows students to submit equipment requests and check their status
- Stores records locally in the browser using LocalStorage
- Exports records and inventory data as CSV files

## Tool Stack

- Frontend: React 19
- Build Tool: Vite 6
- Language: TypeScript
- Styling: Tailwind CSS 4
- Icons: Lucide React
- Motion/Animation: Motion
- Data Persistence: Browser LocalStorage

## User Roles

- Student:
  - Submit sports item requests
  - Check request/issue status using roll number
- Admin:
  - Login to dashboard
  - Approve/reject requests
  - Add/remove inventory items
  - Mark issued items as returned
  - Export records and inventory as CSV

## Workflow

1. Student submits an item request.
2. Admin reviews pending requests.
3. On approval, the system creates an issue record and reduces available inventory.
4. Student can track status by roll number.
5. Admin marks return, and record status updates.

## Data Model (LocalStorage)

- `citk_sports_records`: issued/returned item records
- `citk_sports_inventory`: available stock and condition
- `citk_sports_requests`: student request queue (Pending/Approved/Rejected)
- `citk_is_admin`: admin login session flag

## Validation & Rules

- Roll number must be exactly 12 digits.
- Required fields are checked before submit.
- Item approval is blocked when stock is unavailable.
- Overdue status is calculated from expected return date.
- Approved requests create records with a default 7-day return window.

## Project Structure

- `App.tsx`: main application logic and UI
- `src/main.tsx`: React app bootstrap
- `src/index.css`: styling
- `index.html`: HTML entry file
- `src/types.ts`: shared TypeScript interfaces and unions
- `src/constants.ts`: storage keys and shared constants
- `src/utils/validation.ts`: roll number validation helpers
- `vite.config.ts`: Vite configuration
- `metadata.json`: app metadata

## Available Scripts

- `npm run dev`: run development server (port `3001`)
- `npm run build`: create production build
- `npm run preview`: preview production build locally
- `npm run lint`: TypeScript type-check (`tsc --noEmit`)

## Known Limitations

- Data is stored in browser storage only (no shared database).
- Admin authentication is static/demo style (not production secure).
- No server-side authorization or audit logging.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Start development server:
   `npm run dev`
