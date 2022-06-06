const express = require('express');
const router = express.Router();
const Crosswalk = require('../lineStringModels/crosswalk') // model require
const cors = require('cors');

router.use(cors({
    origin: '*',
    credentials: 'true'
}));

// API 2.1
// GET - /crosswalks
router.get('/', function (req, res) {
    Crosswalk.find({}, function (err, crosswalks) {
        if (err) return res.status(500).send({ error: err });
        const resultList = crosswalks.map(x => {
            return {
                crosswalkIdx: x.idx,
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
                length: x.length
            }
        })
        res.json({ result: resultList });
    });
});

// API 2.2
// POST - /crosswalks
router.post('/', function (req, res) {
    const coordinates = req.body.coordinates;
    for (var idx in coordinates) {
        // array = [lat, lon] [위도, 경도]
        // console.log(coordinates[idx])
        const item = coordinates[idx].splice(1, 1); // [lon(경도)]
        // console.log(item)
        coordinates[idx].splice(0, 0, item[0]); // [lon, lat]
    }
    const length = req.body.length;

    // console.log(coordinates, width, slope, length);
    Crosswalk.create({
        geo: {
            coordinates: coordinates,
        },
        length: length
    }, function (err, crosswalk) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: '입력 성공' });
    })
});

module.exports = router;

