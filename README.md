# CITK Sports Management System

A comprehensive web application designed to streamline the management of sports equipment inventory and student requests for the Central Institute of Technology Kokrajhar (CITK).

## Overview

The CITK Sports Management System serves as a digital platform for the sports department to manage inventory, track equipment issuance, and handle student requests efficiently. It provides a user-friendly interface for both students and administrators.

## Features

### For Students
*   **Browse Inventory:** View available sports equipment and their current stock status.
*   **Submit Requests:** Request sports items online by providing basic details (Name, Roll No, Branch, etc.).
*   **Check Status:** Track the status of requests and view currently issued items by entering the Roll Number.

### For Administrators (Sports Incharge)
*   **Dashboard Analytics:** Get a quick overview of key metrics like Active Loans, Overdue Items, Low Stock alerts, and Most Popular items.
*   **Request Management:** Review pending requests from students with options to Approve or Reject them.
*   **Issue System:** A dedicated form to issue items to students, recording comprehensive details including expected return dates.
*   **Record Tracking:** View a complete history of all transactions. Filter records, check status (Active, Overdue, Returned), and mark items as returned.
*   **Inventory Management:** Add new equipment to the inventory, monitor stock levels, and remove items as needed.
*   **Data Export:** Export issue records and inventory lists to CSV format for offline record-keeping.

## Tech Stack

*   **Frontend Framework:** React (with TypeScript)
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Build Tool:** Vite

## Getting Started

### Prerequisites
*   Node.js (v16 or higher)
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

To start the development server:

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

## Project Structure

*   `/src`: Source code
    *   `App.tsx`: Main application component containing all logic and UI.
    *   `main.tsx`: Entry point.
    *   `index.css`: Global styles and Tailwind imports.
*   `package.json`: Project dependencies and scripts.
*   `vite.config.ts`: Vite configuration.

## License

This project is licensed under the Apache License 2.0.
