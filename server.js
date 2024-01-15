const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const port = 8080;

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: '43.202.79.6',
  user: 'mj1838',
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
app.get('/login', (req, res) => {
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

/* Create Rolling Paper */
app.post('/Roll', (req, res) => {
  const { userId } = req.body;
  const queryPaperID = 'SELECT * FROM paper WHERE userId = ?';

  connection.query(queryPaperID, [userId], (error, results, fields) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0) {
      return res.json({ paperId: '이미 존재하는 롤링 페이퍼임' });
    } else {
      const querySignup = 'INSERT INTO paper (userId) VALUES (?)';

      connection.query(querySignup, [userId], (insertError, insertResults, insertFields) => {
        if (insertError) {
          console.error('Error:', insertError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const newPaperId = insertResults.insertId; // 새롭게 생성된 롤링 페이퍼의 ID

        return res.json({ paperId: newPaperId });
      });
    }
  });
});

/* Show Entire Board */
app.get('/all', (req, res) => {
  const queryAll = `SELECT paperId FROM paper`;
  connection.query(queryAll, (error, results, fields) => {
    if (error) {
      console.error('Error querying MySQL: ', error);
      return res.status(500).json({error: 'Internal Server Error'});
    }
    res.json(results);
  });
});

/* Create Post to Rolling Paper */
app.post('/Toosleepyyy', (req, res) => {
  const { paperId, userId, body } = req.body;
  
  const queryPostAdd = 'INSERT INTO post (userId, paperId, body) VALUES (?, ?, ?)';
  connection.query(queryPostAdd, [userId, paperId, body], (error, results, fields) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const newPostId = results.insertId;
    return res.json({ postId: newPostId });
  });
});

/* Show Entire Posts */
app.get('/fdsfa', (req, res) => {
  const { paperId } = req.query;
  const queryPostAll = `SELECT * FROM post WHERE paperId=?`;
  connection.query(queryPostAll, [ paperId ], (error, results, fields) => {
    if (error) {
      console.error('Error querying MySQL: ', error);
      return res.status(500).json({error: 'Internal Server Error'});
    }
    res.json(results);
  });
});

/* Keep receiving request */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});