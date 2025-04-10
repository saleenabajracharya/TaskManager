const express = require('express');
const { Pool } = require('pg'); 
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL pool connection
const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, 
  ssl: {
    rejectUnauthorized: false,  
  },
});


// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );
    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.status(200).json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Middleware for JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Add a new task
app.post('/tasks', async (req, res) => {
  const { title, description, status, userId } = req.body;
  try {
    await db.query(
      'INSERT INTO tasks (title, description, status, userId) VALUES ($1, $2, $3, $4)',
      [title, description, status, userId]
    );
    res.status(200).json({ message: 'Task created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Fetch tasks for a user
app.get('/tasks/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const result = await db.query('SELECT * FROM tasks WHERE userId = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No tasks found for the user' });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Get task by ID
app.get('/task/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);
  try {
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching task details' });
  }
});

// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, status, userId } = req.body;

  try {
    const result = await db.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, userId = $4 WHERE id = $5',
      [title, description, status, userId, taskId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ id: taskId, title, description, status, userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);
  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
