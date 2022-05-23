// app.js

// [LOAD PACKAGES]
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const markerRoute = require('./routes/marker_index');
const lineStringRoute = require('./routes/line_index');

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
  // CONNECTED TO MONGODB SERVER
  console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/mongodb_tutorial');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]
var port = 3000;


// [RUN SERVER]
app.listen(port, () => {
  console.log("Express server has started on port " + port)
});

app.use('/markers', markerRoute);
app.use('/linestrings', lineStringRoute);

