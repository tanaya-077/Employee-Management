# Employee Management Backend

This is the Express.js backend API for the Employee Management CRUD application. It provides RESTful endpoints to manage employee records stored in a PostgreSQL database.

## Features

- Get all employees
- Add a new employee
- Update employee details
- Delete an employee
- Health check endpoint

## Tech Stack

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [pg](https://node-postgres.com/) (PostgreSQL client)
- [CORS](https://www.npmjs.com/package/cors)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL installed and running
- The database user and password configured in [`db/db.js`](db/db.js)

### Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure Database:**
   - Edit [`db/db.js`](db/db.js) if your PostgreSQL credentials or database name are different.
   - By default, it uses:
     - user: `postgres`
     - password: `1234`
     - database: `postgres`
     - host: `localhost`
     - port: `5432`


### API Endpoints

- `GET /api/employees` — Get all employees
- `POST /api/employees` — Add a new employee
- `PUT /api/employees/:id` — Update an employee
- `DELETE /api/employees/:id` — Delete an employee

### Project Structure

```
backend/
├── app.js           # Main Express app
├── package.json
├── setup.js         # Script to initialize DB and table
├── db/
│   ├── db.js        # PostgreSQL connection
│   └── schema.sql   # Table schema and sample data
└── README.md
```

## Notes

- Make sure PostgreSQL is running and accessible with the credentials in `db/db.js`.
- The backend uses CORS to allow requests from the frontend (`http://localhost:5173`).
- For any issues, check the backend terminal for error logs.

---

**Author:**  
Tanaya khale