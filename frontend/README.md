# Employee Management Frontend

This is the React frontend for the Employee Management CRUD application. It allows you to view, add, edit, delete, and filter employees using a modern UI with [ag-Grid](https://www.ag-grid.com/) and [Tailwind CSS](https://tailwindcss.com/).

## Features

- View all employees in a paginated, sortable, and filterable grid
- Add new employees
- Edit existing employee details
- Delete employees
- Filter/search employees by name, position, department, or salary
- Responsive and modern UI

## Tech Stack

- [React](https://react.dev/)
- [ag-Grid](https://www.ag-grid.com/react-data-grid/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [Vite](https://vitejs.dev/)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- The backend API running (see `/backend` folder)

### Installation

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Start the development server:**
   ```sh
   npm run dev
   ```

3. Open your browser at [http://localhost:5173](http://localhost:5173).

### Configuration

- The frontend expects the backend API to be running at `http://localhost:5000`.
- You can change the API URL in [`src/App.jsx`](src/App.jsx) if needed.

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   └── components/
├── package.json
├── vite.config.js
└── README.md
```

## Useful Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build
- `npm run lint` — Lint the code

## Notes

- Make sure the backend is running and the database is set up before using the frontend.
- For any issues, check the browser console and network tab for errors.

---
