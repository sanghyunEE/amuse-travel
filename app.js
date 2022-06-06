// app.js

// [LOAD PACKAGES]
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const markerRoute = require('./routes/marker_index');
const lineStringRoute = require('./routes/line_index');
const multiLineRoute = require('./routes/multi_index');


const sidewalkRoute = require('./lineStringRoutes/sidewalk_index');
const crosswalkRoute = require('./lineStringRoutes/crosswalk_index');
const overpassRoute = require('./lineStringRoutes/overpass_index');
const underpassRoute = require('./lineStringRoutes/underpass_index');


const liftRoute = require('./markerRoutes/lift_index');
const toiletRoute = require('./markerRoutes/toilet_index');
const parkingRoute = require('./markerRoutes/parking_index');
const stepRoute = require('./markerRoutes/step_index');
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
app.use('/multiline', multiLineRoute);

app.use('/sidewalks', sidewalkRoute);
app.use('/crosswalks', crosswalkRoute);
app.use('/overpasses', overpassRoute);
app.use('/underpasses', underpassRoute);

app.use('/lifts', liftRoute);
app.use('/toilets', toiletRoute);
app.use('/parkings', parkingRoute);
app.use('/steps', stepRoute);