const express = require('express');
const router = express.Router();
const LineString = require('../models/linestring') // model require
const cors = require('cors');

router.use(cors({
    origin: '*',
    credentials: 'true'
}));

// API 1.1
// GET - /linestrings
router.get('/', function (req, res) {
    LineString.find({}, function (err, lineStrings) {
        if (err) return res.status(500).send({ error: err });
        const resultList = lineStrings.map(x => {
            return {
                name: x.name,
                coordinates: [
                    {
                        lat: x.geo.coordinates[0][1],
                        lon: x.geo.coordinates[0][0]
                    },
                    {
                        lat: x.geo.coordinates[1][1],
                        lon: x.geo.coordinates[1][0]
                    }
                ],
                category: x.category
            }
        })
        res.json({ result: resultList });
    });
});

// API 1.2
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

module.exports = router;

