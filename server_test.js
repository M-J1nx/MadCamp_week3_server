const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require("cors");
const app = express();

var mod = require('korean-text-analytics');
var task = new mod.TaskQueue();
app.post('/keyword', (req, res) => {
  const { body } = req.body;
  mod.ExecuteMorphModule(body, function(err, rep) {
    console.log(err, rep);
  })
})
