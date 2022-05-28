const express = require('express');
const router = express.Router();
const MultiLine = require('../models/multiline') // model require
const cors = require('cors');

router.use(cors({
    origin: '*',
    credentials: 'true'
}));

// API 1.1
// GET - /multiline
router.get('/', function (req, res) {
    MultiLine.find({}, function (err, multilines) {
        if (err) return res.status(500).send({ error: err });
        // const resultList = lineStrings.map(x => {
        //     return {
        //         name: x.name,
        //         coordinates: x.geo.coordinates,
        //         category: x.category
        //     }
        // })
        res.json({ result: multilines });
    });
});

// API 1.2
// POST - /linestrings
router.post('/', function (req, res) {
    const name = req.body.name;
    const coordinates = req.body.coordinates;
    const category = req.body.category;
    console.log(coordinates)
    MultiLine.create({
        name: name,
        geo: {
            coordinates: coordinates,
        }
    }, function (err, multiline) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: multiline });
    })
});

module.exports = router;

