const express = require('express');
const router = express.Router();
const Underpass = require('../lineStringModels/underpass') // model require
const cors = require('cors');

router.use(cors({
    origin: '*',
    credentials: 'true'
}));

// API 4.1
// GET - /underpasses
router.get('/', function (req, res) {
    Underpass.find({}, function (err, underpasses) {
        if (err) return res.status(500).send({ error: err });
        const resultList = underpasses.map(x => {
            return {
                underpassIdx: x.idx,
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
                length: x.length
            }
        })
        res.json({ result: resultList });
    });
});

// API 4.2
// POST - /underpasses
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
    const length = req.body.length;

    // console.log(coordinates, width, slope, length);
    Underpass.create({
        geo: {
            coordinates: coordinates,
        },
        width: width,
        length: length
    }, function (err, underpass) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: '입력 성공' });
    })
});

module.exports = router;

