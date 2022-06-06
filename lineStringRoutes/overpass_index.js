const express = require('express');
const router = express.Router();
const Overpass = require('../lineStringModels/overpass') // model require
const cors = require('cors');

router.use(cors({
    origin: '*',
    credentials: 'true'
}));

// API 3.1
// GET - /overpasses
router.get('/', function (req, res) {
    Overpass.find({}, function (err, overpasses) {
        if (err) return res.status(500).send({ error: err });
        const resultList = overpasses.map(x => {
            return {
                overpassIdx: x.idx,
                name: x.name,
                serialNumber: x.serialNumber,
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
                height: x.height,
                length: x.length
            }
        })
        res.json({ result: resultList });
    });
});

// API 3.2
// POST - /overpasses
router.post('/', function (req, res) {
    const name = req.body.name;
    const serialNumber = req.body.serialNumber;
    const coordinates = req.body.coordinates;
    for (var idx in coordinates) {
        // array = [lat, lon] [위도, 경도]
        // console.log(coordinates[idx])
        const item = coordinates[idx].splice(1, 1); // [lon(경도)]
        // console.log(item)
        coordinates[idx].splice(0, 0, item[0]); // [lon, lat]
    }
    const width = req.body.width;
    const height = req.body.height;
    const length = req.body.length;

    // console.log(coordinates, width, slope, length);
    Overpass.create({
        name: name,
        serialNumber: serialNumber,
        geo: {
            coordinates: coordinates,
        },
        width: width,
        height: height,
        length: length
    }, function (err, overpass) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: '입력 성공' });
    })
});

module.exports = router;

