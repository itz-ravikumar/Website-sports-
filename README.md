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

## 🔑 Default Admin Credentials

For initial setup and testing:
- **Username:** `admin`
- **Password:** `admin`

⚠️ **Important:** Change these credentials in production!

## API Documentation

### Core Endpoints

#### Students
- `GET /api/inventory` - Get all available equipment
- `POST /api/requests` - Submit a request for equipment
- `GET /api/requests/:studentId` - Check request status
- `GET /api/records/:rollNo` - View issued items

#### Administrators
- `POST /api/admin/login` - Admin authentication
- `GET /api/dashboard` - Get dashboard analytics
- `POST /api/issue` - Issue equipment to student
- `POST /api/return` - Process equipment return
- `POST /api/inventory` - Add new equipment
- `GET /api/reports` - Export data reports

## 📝 Usage Examples

### Student Workflow
1. Browse available equipment in digital inventory
2. Submit a request with your details (Name, Roll No, Branch)
3. Track request status in real-time
4. Pick up issued equipment with expected return date

### Admin Workflow
1. Login to dashboard with admin credentials
2. View analytics (active loans, overdue items, stock levels)
3. Approve/reject pending student requests
4. Issue equipment and track returns
5. Generate CSV reports for record-keeping

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# If port 3000 is already in use, modify server.js:
# Change PORT environment variable
PORT=5000 npm run dev
```

### Database Issues
```bash
# Reset database (deletes all data):
rm sports.db
npm run dev  # Database will be recreated
```

### Dependencies Not Installing
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Future Enhancements

- [ ] Email notifications for request status updates
- [ ] Mobile app for iOS/Android
- [ ] QR code scanning for equipment checkout
- [ ] Analytics dashboard with graphs and charts
- [ ] Multi-language support
- [ ] Equipment damage tracking and maintenance logs
- [ ] Automated penalty system for overdue returns
- [ ] Integration with institutional calendar

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and commit them (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test your changes before submitting PR
- Update README if adding new features

## 📧 Support & Contact

For issues, questions, or suggestions:
- **Open an Issue** on GitHub
- **Email:** (Add your contact email)
- **LinkedIn:** ravi-kumar-186984301

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for **Central Institute of Technology Kokrajhar (CITK)**
- Powered by **React**, **Express.js**, and **SQLite**
- Styled with **Tailwind CSS v4**
