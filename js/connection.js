import express from 'express';
import mysql from 'mysql';
import cors from 'cors'; // Import the CORS middleware
import nodemailer from 'nodemailer';

const app = express();
const port = 3000;

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'old_westbury'
});

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email provider (e.g., 'gmail', 'yahoo', or SMTP config)
  auth: {
    user: 'shahmeer.ny1@gmail.com', // Replace with your email
    pass: 'Shahmeer11001@' // Replace with your email password or app-specific password
  }
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
  connection.query('SELECT * FROM signup WHERE name = ?', [username], (err, results) => {
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

// app.post('/signup', (req, res) => {
//   const {username, email, password, confirmPassword, role} = req.body; 

//   console.log('Received data:', { username, email, password, confirmPassword, role });

//   if (!username || !email || !password || !role) {
//     return res.status(400).json({ error: 'name, email,password, confirmPassword and role are required' });
//   }
// // Check if the user exists in the database
// const sql = 'INSERT INTO signup (name, email, password, role VALUES (?, ?, ?, ?)';
// const VALUES = [username, email, password, role];
//     (err, results) => {
//   if (err) {
//   return res.status(500).send('Server error');
//   }

//   if (results.length === 0) {
//     return res.status(400).json({ error: 'Invalid name, email, password, confirmPassword or role' });
//   }

//   res.json({ success: true, message: 'Registration Successful'});
// }
// });


app.post('/signup', (req, res) => {
  const { username, email, password, confirmPassword, dropdown } = req.body;

  console.log('Received data:', { username, email, password, confirmPassword, dropdown });

  // Check if required fields are present
  if (!username || !email || !password || !confirmPassword || !dropdown) {
    return res.status(400).json({ error: 'Username, email, password, confirmPassword and role are required' });
  }

  // Query to check if the user already exists
  const checkUserSQL = 'SELECT * FROM signup WHERE email = ?';
  
  // Check if the user exists
  connection.query(checkUserSQL, [email], (err, results) => {
    if (err) {
      console.error('Server error:', err);
      return res.status(500).send('Server error');
    }

    // If user already exists, return an error
    if (results.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Query to insert the new user
    const insertSQL = 'INSERT INTO signup (name, email, password, confirmPassword, role) VALUES (?, ?, ?, ?, ?)';
    const values = [username, email, password, confirmPassword, dropdown];

    // Insert the new user
    connection.query(insertSQL, values, (err, result) => {
      if (err) {
        console.error('Server error:', err);
        return res.status(500).send('Server error');
      }

      res.json({ success: true, message: 'Registration successful' });
    });
  });
});



app.post('/send-email', (req, res) => {
  const { email } = req.body;

  console.log('Received data:', { email});

  // Check if required fields are present
  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  // Query to check if the user already exists
  const checkUserSQL = 'SELECT * FROM signup WHERE email = ?';
  
  // Check if the user exists
  connection.query(checkUserSQL, [email], (err, results) => {
    if (err) {
      console.error('Server error:', err);
      return res.status(500).send('Server error');
    }

    // If user already exists, return an error
    if (results.length > 0) {
      // return res.json({ success: true, message: 'Email sent Please check your inbox' });
    }

    const mailOptions = {
      from: 'Shahmeer.ny1@gmail.com',
      to: email,
      subject: 'Welcome to Our Service',
      text: 'Hello, welcome to our platform! We are excited to have you.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      }
      console.log('Email sent: ' + info.response);
      res.json({ success: true, message: 'Email sent successfully' });
    });

 
    // res.json({ success: true, message: 'Email sent' });

})
});







app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



