import express from 'express';
import mysql from 'mysql';
import cors from 'cors'; // Import the CORS middleware

const app = express();
const port = 3000;

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'old_westbury'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});


app.use(express.json()); // <--- Add this line
// 
// app.use(cors({ origin: '*', credentials: true })); // Allow the specific frontend origin
// app.use(cors({ origin: 'http://127.0.0.1:5500', credentials: true })); // Allow the specific frontend origin
// CORS setup
app.use(cors({
  origin: '*', // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Enable credentials (cookies, authentication headers, etc.)
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers
}));

// API route to get data from MySQL
app.get('/', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Received data:', { username, password });

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if the user exists in the database
  connection.query('SELECT * FROM users WHERE name = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password here' });
    }

    const user = results[0];

    // In a real application, you should hash and compare the password
    if (user.password != password) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // If login is successful
    res.json({ success: true, message: 'Login Successful'});
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
