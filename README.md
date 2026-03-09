# CITK Sports Management System

Web-based sports issue, return, and inventory tracker for Central Institute of Technology Kokrajhar (CITK).

## Overview

This application helps two groups work in one system:

- Students can request sports items and track their request/issue status using roll number.
- Admin can manage inventory, approve or reject requests, issue items, mark returns, and export data.

The app is a frontend-only project and stores all data in browser LocalStorage.

## Key Features

- Student request submission flow
- Student status lookup by roll number
- Admin login flow (demo credentials)
- Inventory add/remove with quantity tracking
- Issue records with expected return date
- Overdue/active/returned status management
- CSV export for records and inventory
- Local persistence across browser refreshes

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Lucide React (icons)

## Project Structure

```
.
|- App.tsx
|- index.html
|- metadata.json
|- package.json
|- tsconfig.json
|- vite.config.ts
`- src/
  |- constants.ts
  |- index.css
  |- main.tsx
  |- types.ts
  `- utils/
    `- validation.ts
```

## Local Data Storage

The app uses these LocalStorage keys:

- `citk_sports_records` -> issue/return records
- `citk_sports_inventory` -> inventory and available stock
- `citk_sports_requests` -> pending/approved/rejected requests
- `citk_is_admin` -> admin session state

## Validation Rules

- Roll number must be exactly 12 digits
- Roll number input is sanitized to digits only
- Issue is blocked when item is unavailable
- Inventory quantity must be a positive integer
- Overdue state is computed from expected return date

## Scripts

- `npm run dev` -> starts Vite dev server on port `3001`
- `npm run build` -> creates production build
- `npm run preview` -> previews production build
- `npm run lint` -> TypeScript check (`tsc --noEmit`)
- `npm run clean` -> removes `dist` folder

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and Run

```bash
npm install
npm run dev
```

Open the app in your browser using the URL shown in terminal output.

### Build for Production

```bash
npm run build
npm run preview
```

## Admin Access (Demo)

- Username: `admin`
- Password: `admin`

This is for demo/testing only and is not production authentication.

## Configuration Notes

- Path alias `@` maps to `src/` (configured in `tsconfig.json` and `vite.config.ts`).
- Vite server HMR can be disabled with env var `DISABLE_HMR=true`.

## Limitations

- No backend/database (single-browser data scope)
- No secure authentication or authorization
- No audit logging or role permissions beyond basic admin mode

## Suggested Next Improvements

- Replace demo auth with secure backend authentication
- Move LocalStorage data to a real database
- Add API-based multi-user sync
- Add tests (unit + integration)
- Add role-based access control and audit trail

## Git Workflow (Commit + Push to GitHub)

Use these commands from project root:

```bash
git add README.md
git commit -m "docs: rewrite README with full project documentation"
git push origin <your-branch>
```

If remote is not configured yet:

```bash
git remote add origin https://github.com/<username>/<repo>.git
git branch -M main
git push -u origin main
```

## License

This repository currently does not define a license file. Add `LICENSE` if open-source distribution is intended.
