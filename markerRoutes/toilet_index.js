const express = require('express');
const router = express.Router();
const Toilet = require('../markerModels/toilet') // model require
const cors = require('cors');

router.use(cors({
    origin: '*',
    credentials: 'true'
}));

// API 5.1
// GET - /toilets
router.get('/', function (req, res) {
    Toilet.find({}, function (err, toilets) {
        if (err) return res.status(500).send({ error: err });
        const resultList = toilets.map(x => {
            return {
                toiletIdx: x.idx,
                coordinates: {
                    lat: x.coordinates[1],
                    lon: x.coordinates[0]
                },
                isDisabledToilet: x.isDisabledToilet
            }
        });
        res.json({ result: resultList });
    });
});


// API 5.2
// POST - /toilets
router.post('/', function (req, res) {
    const coordinates = req.body.coordinates;

    // coordinates = [lat, lon] [위도, 경도]
    // console.log(coordinates[idx])
    const item = coordinates.splice(1, 1); // [lon(경도)]
    // console.log(item)
    coordinates.splice(0, 0, item[0]); // [lon, lat]
    const isDisabledToilet = req.body.isDisabledToilet;

    Toilet.create({
        coordinates: coordinates,
        isDisabledToilet: isDisabledToilet
    }, function (err, toilet) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: "입력 성공" });
    });
});


module.exports = router;

