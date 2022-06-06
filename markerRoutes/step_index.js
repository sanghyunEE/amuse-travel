const express = require('express');
const router = express.Router();
const Step = require('../markerModels/step') // model require
const cors = require('cors');

router.use(cors({
    origin: '*',
    credentials: 'true'
}));

// API 5.1
// GET - /toilets
router.get('/', function (req, res) {
    Step.find({}, function (err, toilets) {
        if (err) return res.status(500).send({ error: err });
        const resultList = toilets.map(x => {
            return {
                stepIdx: x.idx,
                coordinates: {
                    lat: x.coordinates[1],
                    lon: x.coordinates[0]
                },
                stepHeight: x.stepHeight
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
    const stepHeight = req.body.stepHeight;

    Step.create({
        coordinates: coordinates,
        stepHeight: stepHeight
    }, function (err, toilet) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: "입력 성공" });
    });
});


module.exports = router;

