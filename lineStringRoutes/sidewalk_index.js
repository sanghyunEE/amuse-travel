const express = require('express');
const router = express.Router();
const Sidewalk = require('../lineStringModels/sidewalk') // model require
const cors = require('cors');

router.use(cors({
    origin: '*',
    credentials: 'true'
}));

// API 1.1
// GET - /sidewalks
router.get('/', function (req, res) {
    Sidewalk.find({}, function (err, sidewalks) {
        if (err) return res.status(500).send({ error: err });
        const resultList = sidewalks.map(x => {
            return {
                sidewalkIdx: x.idx,
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
                width: x.width,
                slope: x.slope,
                length: x.length
            }
        })
        res.json({ result: resultList });
    });
});

// API 1.2
// POST - /sidewalks
router.post('/', function (req, res) {
    const coordinates = req.body.coordinates;
    for (var idx in coordinates) {
        // array = [lat, lon] [위도, 경도]
        // console.log(coordinates[idx])
        const item = coordinates[idx].splice(1, 1); // [lon(경도)]
        // console.log(item)
        coordinates[idx].splice(0, 0, item[0]); // [lon, lat]
    }
    const width = req.body.width;
    const slope = req.body.slope;
    const length = req.body.length;

    // console.log(coordinates, width, slope, length);
    Sidewalk.create({
        geo: {
            coordinates: coordinates,
        },
        width: width,
        slope: slope,
        length: length
    }, function (err, sidewalk) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: '입력 성공' });
    })
});

module.exports = router;

