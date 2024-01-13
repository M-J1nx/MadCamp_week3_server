const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const port = 3001;

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tj11021223',
  database: 'madcampweek3'
});

app.use(cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
}))

connection.connect();

/* Login Page */
app.post('/login', (req, res) => {
    const { userId, userPw } = req.body;
    const queryID = 'SELECT * FROM user WHERE userId = ?';

    connection.query(queryID, [userId], (error, results, fields) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            const storedPassword = results[0].userPw;
            const userName = results[0].userName;

            if (userPw === storedPassword) {
                return res.json({ message: 'true', userName: userName });
            } else {
                return res.json({ message: 'false1', userName: 'false'  });
            }
        } else {
            res.json({ message: 'false2', userName: 'false'  });
        }
    });
});


/* Sign up Page */
app.post('/signup', (req, res) => {
    const { userId, userPw, userName } = req.body;
    const queryIDCheck = 'SELECT * FROM user WHERE userId = ?';
  
    connection.query(queryIDCheck, [userId], (error, results, fields) => {
      if (error) {
        console.error('Error checking userId:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length > 0) {
        return res.json({ message: 'false' });
      } else {
        const querySignup = 'INSERT INTO user (userId, userPw, userName) VALUES (?, ?, ?)';
        connection.query(querySignup, [userId, userPw, userName], (error, results, fields) => {
          if (error) {
            console.error('Error during signup:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          return res.json({ message: 'true' }); 
        });
      }
    });
  });
  

/* Keep receiving request */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
