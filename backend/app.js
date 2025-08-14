const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const setupDatabase = require('./setup');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// setupDatabase()

// Health
app.get('/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Get all employees
app.get('/api/employees', async (_req, res) => {
  try {
    const result = await db.query('SELECT * FROM employees ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, position, department, salary } = req.body;
    if (!name || !position || !department) {
      return res.status(400).json({ error: 'Name, position, and department are required' });
    }
    const salaryValue = salary === '' || salary === undefined || salary === null ? null : Number(salary);
    if (salaryValue !== null && Number.isNaN(salaryValue)) {
      return res.status(400).json({ error: 'Salary must be a number' });
    }

    const q = `
      INSERT INTO employees (name, position, department, salary)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await db.query(q, [name, position, department, salaryValue]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, department, salary } = req.body;

    // Confirm exists
    const exists = await db.query('SELECT id FROM employees WHERE id = $1', [id]);
    if (exists.rowCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const salaryValue = salary === '' || salary === undefined || salary === null ? null : Number(salary);
    if (salaryValue !== null && Number.isNaN(salaryValue)) {
      return res.status(400).json({ error: 'Salary must be a number' });
    }

    const q = `
      UPDATE employees
      SET name = $1,
          position = $2,
          department = $3,
          salary = $4
      WHERE id = $5
      RETURNING *;
    `;
    const { rows } = await db.query(q, [name, position, department, salaryValue, id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await db.query('SELECT id FROM employees WHERE id = $1', [id]);
    if (exists.rowCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await db.query('DELETE FROM employees WHERE id = $1', [id]);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
