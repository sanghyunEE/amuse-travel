const express = require('express');
const router = express.Router();
const Parking = require('../markerModels/parking') // model require
const cors = require('cors');

router.use(cors({
    origin: '*',
    credentials: 'true'
}));

// API 5.1
// GET - /parkings
router.get('/', function (req, res) {
    Parking.find({}, function (err, parkings) {
        if (err) return res.status(500).send({ error: err });
        const resultList = parkings.map(x => {
            return {
                parkingIdx: x.idx,
                coordinates: {
                    lat: x.coordinates[1],
                    lon: x.coordinates[0]
                }
            }
        });
        res.json({ result: resultList });
    });
});


// API 5.2
// POST - /parkings
router.post('/', function (req, res) {
    const coordinates = req.body.coordinates;

    // coordinates = [lat, lon] [위도, 경도]
    // console.log(coordinates[idx])
    const item = coordinates.splice(1, 1); // [lon(경도)]
    // console.log(item)
    coordinates.splice(0, 0, item[0]); // [lon, lat]

    Parking.create({
        coordinates: coordinates
    }, function (err, parking) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: "입력 성공" });
    });
});


module.exports = router;

