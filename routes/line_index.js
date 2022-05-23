const express = require('express');
const router = express.Router();
const LineString = require('../models/linestring') // model require


// GET - /linestrings
router.get('/', function (req, res) {
    LineString.find({}, function (err, lineStrings) {
        if (err) return res.status(500).send({ error: err });
        const resultList = lineStrings.map(x => {
            return {
                name: x.name,
                coordinates: x.geo.coordinates,
                category: x.category
            }
        })
        res.json({ result: resultList });
    });
});

// POST - /linestrings
router.post('/', function (req, res) {
    const name = req.body.name;
    const coordinates = req.body.coordinates;
    const category = req.body.category;

    LineString.create({
        name: name,
        geo: {
            coordinates: coordinates,
        },
        category: category
    }, function (err, lineString) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: lineString });
    })
});

// API 2.3
// 

module.exports = router;

// module.exports = function (app, LineString) {

//   // Get All Linestrings
//   app.get('/api/linestrings', function (req, res) {
//     LineString.find(function (err, linestrings) {
//       if (err) return res.status(500).send({ error: 'database failure' });
//       res.json(linestrings);
//     })
//   });

//   // Create Linestring
//   app.post('/api/linestrings', function (req, res) {
//     var lineString = new LineString();
//     lineString.name = req.body.name;
//     lineString.geo.coordinates = req.body.coordinates;
//     lineString.category = req.body.category;

//     lineString.save(function (err) {
//       if (err) {
//         console.error(err);
//         res.json({ result: 0 });
//         return;
//       }

//       res.json({ result: 1 });

//     });
//   });



// }

