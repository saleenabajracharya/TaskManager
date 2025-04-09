const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Initialize dotenv
dotenv.config();

const app = express();
app.use(express.json()); 
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating user' });
      }
      res.status(200).json({ message: 'User registered successfully' });
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });

      res.status(200).json({user : { id:user.id, email : user.email, name: user.name}, token: token})
    });
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

//Add a new task
app.post('/tasks', async (req,  res, next) =>{
    try{
        const { title, description, status, userId } = req.body;
        const query = 'INSERT INTO tasks (title, description, status, userId) VALUES (?, ?, ?, ?)';
        db.query(query, [title, description, status, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating task' });
        }
      res.status(200).json({ message: 'Task created successfully' });
    });
    }catch(error){
        console.log("Error:",error);
    }

})


//Fetch the user's tasks
app.get('/tasks/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const query = 'SELECT * FROM tasks where userId = ?';
        db.query(query, [userId], (err, result) => {
          if (err) {
              return res.status(500).json({ message: 'Error fetching tasks' });
          }

          if (result.length === 0) {
              return res.status(404).json({ message: 'No tasks found for the user' });
          }

          res.status(200).json(result);
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { title, description, status, userId } = req.body;

  const query = `
    UPDATE tasks 
    SET title = ?, description = ?, status = ?, userId = ?
    WHERE id = ?
  `;
  db.query(query, [title, description, status, userId, taskId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating task" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ id: taskId, title, description, status, userId });
  });
});


app.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  const query = "DELETE FROM tasks WHERE id = ?";
  db.query(query, [taskId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting task" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  });
});

app.get("/task/:id", (req, res) => {
  const taskId = req.params.id;
  
  const query = "SELECT * FROM tasks WHERE id = ?";
  db.query(query, [taskId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching task details" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(result[0]); 
  });
});




// Start the server
app.listen(5000, () => {
  console.log('Server running!');
});
