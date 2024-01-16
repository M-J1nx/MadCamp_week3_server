const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require("cors");
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: '43.202.79.6',
  user: 'mj1838',
  password: 'tj11021223',
  database: 'madcampWeek3'
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
  //const queryAll = `SELECT paperId FROM paper`;
  const queryAll = `SELECT * FROM paper INNER JOIN user ON paper.userId=user.userId`;
  connection.query(queryAll, (error, results, fields) => {
    if (error) {
      console.error('Error querying MySQL: ', error);
      return res.status(500).json({error: 'Internal Server Error'});
    }
    res.json(results);
  });
});

/* Create Post to Rolling Paper */
app.post('/savepost', (req, res) => {
  const { paperId, userId, body } = req.body;
  
  const queryPostAdd = 'INSERT INTO post (paperId, userId, body) VALUES (?, ?, ?)';
  connection.query(queryPostAdd, [paperId, userId, body], (error, results, fields) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
    const newPostId = results.insertId;
    return res.json({ postId: newPostId });
  });
});

/* Show Entire Posts */
app.get('/getpost', (req, res) => {
  const { paperId } = req.query;
  // const queryPostAll = `SELECT * FROM post WHERE paperId=?`;
  const queryPostAll = `SELECT * FROM user INNER JOIN post ON user.userId = post.userId WHERE paperId=?`;
  connection.query(queryPostAll, [ paperId ], (error, results, fields) => {
    if (error) {
      console.error('Error querying MySQL: ', error);
      return res.status(500).json({error: 'Internal Server Error'});
    }
    res.json(results);
  });
});

/* Show User Board */
app.get('/getname', (req, res) => {
  const { paperId } = req.query;
  const queryAll = `SELECT * FROM user INNER JOIN paper ON user.userId = paper.userId WHERE paperId=?`;
  connection.query(queryAll, [ paperId ], (error, results, fields) => {
    if (error) {
      console.error('Error querying MySQL: ', error);
      return res.status(500).json({error: 'Internal Server Error'});
    }
    res.json(results);
  });
});

/* Chceck paper */
app.post('/hasroll', (req, res) => {
  const { userId } = req.body;
  const queryUserPaper = `SELECT paperId, COUNT(*) AS count FROM paper WHERE userId=? GROUP BY paperId`;
  
  connection.query(queryUserPaper, [userId], (error, results, fields) => {
    if (error) {
      console.error('Error querying MySQL: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const paperIds = results.map(result => result.paperId);

    if (paperIds.length > 0) {
      res.json({ message: 'true', paperId: paperIds });
    } else {
      res.json({ message: 'false' });
    }
  });
});

/* Get user all posts body */
app.get('/result', (req, res) => {
  const { paperId } = req.query;
  const queryGetPostBody = `SELECT * FROM post WHERE paperId=?`;

  connection.query(queryGetPostBody, [ paperId ], (error, results, fields) => {
    if (error) {
      console.error('Error querying MySQL: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json(results);
  });
});

/* Delete post */
app.post('/delpost', (req, res) => {
  const { postId, userId } = req.body;
  const queryCheckUser = `SELECT * FROM post WHERE postId=?`;

  connection.query(queryCheckUser, [postId], (error, results, fields) => {
    if (error) {
      console.error('Error querying MySQL: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results[0].userId === userId) {
      const queryDeletePost = `DELETE FROM post WHERE postId=?`;
      connection.query(queryDeletePost, [postId], (error, deleteResults, deleteFields) => {
        if (error) {
          console.error('Error deleting post from MySQL: ', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json({ message: 'true' });
      });
    } else {
      return res.json({ message: 'false' });
    }
  });
});

/* API */
app.post('/api', async (req, res) => {
  const { result } = req.body;
  const content = JSON.stringify(result);

  var client_id = "mdyy1cdvly";
  var client_secret = "32GVEkD8L7xwRoaMnRgGnLbTVZJ87tyo7M6Blt46";
  var headers = {
    "X-NCP-APIGW-API-KEY-ID": client_id,
    "X-NCP-APIGW-API-KEY": client_secret,
    "Content-Type": "application/json"
  };

  var language = "ko";
  var model = "news";
  var tone = "2";
  var summaryCount = "1";
  var title = "";
  var url = "https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize";
  var data = {
    "document": {
      "title": title,
      "content": content
    },
    "option": {
      "language": language,
      "model": model,
      "tone": tone,
      "summaryCount": summaryCount
    }
  };

  try {
    const response = await axios.post(url, data, { headers: headers });
    var rescode = response.status;
    if (rescode === 200) {
      console.log(response.data);
      res.json(response.data); // 수정된 부분
    } else {
      console.log("Error: " + response.data);
      res.status(rescode).json({ error: response.data }); // 수정된 부분
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: 'Internal Server Error' }); // 수정된 부분
  }
});

/* 형태소 */
app.post('/part', (req, res) => {
  const { result } = req.body;
  const content = JSON.stringify(result);

  var openApiURL = "http://aiopen.etri.re.kr:8000/WiseNLU"; 

  var access_key = '927d719a-0821-4809-b527-3046f1d61a2e';
  var analysisCode = 'morp';
  var text = content;

  var requestJson = {  
    'argument': {
        'text': text,
        'analysis_code': analysisCode
    }
  };

  var request = require('request');
  var options = {
      url: openApiURL,
      body: JSON.stringify(requestJson),
      headers: {'Content-Type':'application/json','Authorization':access_key}
  };
  request.post(options, function (error, response, body) {
      res.json(body);
  });

})


/* Keep receiving request */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
