# CITK Sports Management System

A comprehensive full-stack web application designed to streamline the management of sports equipment inventory, student requests, and issuance records for the Central Institute of Technology Kokrajhar (CITK).

## Overview

The CITK Sports Management System digitizes the sports department's operations, replacing manual logs with an efficient, database-backed solution. It serves two primary user groups:
1.  **Students**: Can view available equipment, submit requests, and check their loan status.
2.  **Administrators (Sports Incharge)**: Can manage inventory, approve/reject requests, issue items, track returns, and view analytics.

## Features

### 🎓 For Students
*   **Digital Inventory:** Browse available sports equipment and check real-time stock status.
*   **Online Requests:** Submit requests for sports items by providing details like Name, Roll No, and Branch.
*   **Status Tracking:** Check the status of pending requests and view currently issued items by entering a Roll Number.
*   **Campus Info:** Access information about CITK sports facilities and institutional details.

### 🛡️ For Administrators
*   **Dashboard Analytics:** Real-time overview of Active Loans, Overdue Items, Low Stock alerts, and Popular Items.
*   **Request Management:** Review pending student requests with options to Approve (auto-issues item) or Reject.
*   **Issue & Return System:** 
    *   Issue items directly to students with expected return dates.
    *   Mark items as returned to update inventory automatically.
*   **Inventory Control:** Add new equipment, update stock levels, and remove obsolete items.
*   **Data Export:** Download comprehensive CSV reports for Inventory and Issue Records.
*   **Secure Access:** Admin-protected routes and actions.

## Tech Stack

### Frontend
*   **Languages:** HTML, CSS, JavaScript
*   **Library:** React (Minimal usage)
*   **Styling:** Tailwind v4 (Custom CITK Theme)
*   **Icons:** Lucide React
*   **Animations:** Motion

### Backend
*   **Runtime:** Node.js
*   **Server:** Express v4
*   **Database:** SQLite (via `better-sqlite3`)
*   **API:** RESTful JSON API

## Project Structure

```text
/
├── server/                 # Backend Logic
│   ├── db.js               # Database connection & schema initialization
│   ├── server.js           # Express application entry point
│   └── routes/             # API route definitions
├── src/                    # Frontend Logic
│   ├── App.jsx             # Main React application component
│   ├── index.css           # Global styles & Tailwind configuration
│   └── main.jsx            # React entry point
├── sports.db               # SQLite database file (auto-created)
├── package.json            # Dependencies & scripts
└── vite.config.js          # Build configuration
```

## Database Schema

The application uses a local SQLite database (`sports.db`) with the following tables:

1.  **`inventory`**: Tracks equipment stock (`id`, `name`, `totalQuantity`, `availableQuantity`, `condition`).
2.  **`requests`**: Manages student requests (`studentName`, `rollNumber`, `branch`, `program`, `itemName`, `status`).
3.  **`records`**: Logs active and historical loans (`studentName`, `rollNumber`, `issueDate`, `expectedReturnDate`, `status`).
4.  **`users`**: Handles admin authentication (`username`, `password`, `role`).

## Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd citk-sports-management-system
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the development server (runs both Express backend and Vite frontend):

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

This project is licensed under the Apache License 2.0.
