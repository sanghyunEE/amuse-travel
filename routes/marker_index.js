const express = require('express');
const router = express.Router();
const Marker = require('../models/marker') // model require
const cors = require('cors');

router.use(cors({
    origin: '*',
    credentials: 'true'
}));

// API 1.1
// 모든 마커 정보 조회 API
// GET - /markers
router.get('/', function (req, res) {
    Marker.find({}, function (err, markers) {
        if (err) return res.status(500).send({ error: err });
        const resultList = markers.map(x => {
            return {
                name: x.name,
                coordinates: {
                    lat: x.coordinates[1],
                    lon: x.coordinates[0]
                },
                category: x.category
            }
        });
        res.json({ result: resultList });
    });
});



// API 1.2
// GET - /markers/near?lon=&lat=
// GET - /markers/near?a=38.9419+-78.3020 -> /markers/naer?a=
// GET - /markers/:markerId/near or /markers/near/:markerId
// :markerId 는 클라이언트가 줘야하며, 그 markerId는 
// 백엔드 의 특정 marker의 Id를 반환하는 API로 클라에게 전달 되는 것.
router.get('/near', function (req, res) {
    const longitude = Number(req.query.lon);
    const latitude = Number(req.query.lat);
    console.log(longitude, latitude);
    Marker.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                distanceField: "dist.calculated",
                spherical: true
            }
        },
        { $limit: 5 }
    ], function (err, markers) {
        if (err) return res.status(500).send({ error: err });
        const resultList = markers.map(x => {
            return {
                name: x.name,
                type: x.type,
                coordinates: {
                    lat: x.coordinates[1],
                    lon: x.coordinates[0]
                },
                category: x.category,
                dist: x.dist.calculated
            }
        });
        res.json({ result: resultList });
    });
});


// API 1.3
// 특정 위치 에서 특정 반지름 만큼 내에 있는 모든 좌표 반환
// GET - /markers/within/radius?lon=&lat=&rad=
router.get('/within/radius', function (req, res) {
    const longitude = Number(req.query.lon);
    const latitude = Number(req.query.lat);
    const radius = Number(req.query.rad);
    console.log(longitude, latitude, radius)
    Marker.find({
        coordinates: {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], radius / 6378.1] // 5 / 6378.1 -> km radius / 10 / 3963.2 -> mile radius
            }
        }
    }, function (err, markers) {
        if (err) return res.status(500).send({ error: err });
        const resultList = markers.map(x => {
            return {
                name: x.name,
                type: x.type,
                coordinates: {
                    lat: x.coordinates[1],
                    lon: x.coordinates[0]
                },
                category: x.category,
            }
        });
        res.json({ result: resultList });
    });
});


// API 1.4
// 특정 박스 내에 있는 모든 마커 반환
router.get('/within/box', function (req, res) {
    console.log(req.query.box.split('/').slice(0, 2));
    leftRight = req.query.box.split('/').slice(0, 2);
    left_x = Number(leftRight[0].split(',')[0])
    left_y = Number(leftRight[0].split(',')[1])
    right_x = Number(leftRight[1].split(',')[0])
    right_y = Number(leftRight[1].split(',')[1])
    console.log(left_x, left_y, right_x, right_y)
    Marker.find({
        coordinates: {
            $geoWithin: {
                $box: [[left_x, left_y], [right_x, right_y]]
            }
        }
    }, function (err, markers) {
        if (err) return res.status(500).send({ error: err });
        const resultList = markers.map(x => {
            return {
                name: x.name,
                type: x.type,
                coordinates: {
                    lat: x.coordinates[1],
                    lon: x.coordinates[0]
                },
                category: x.category,
            }
        });
        res.json({ result: resultList });
    });
});




// API 1.5
// 한 개의 좌표 삽입 API
// POST - /markers
router.post('/', function (req, res) {
    const name = req.body.name;
    const coordinates = req.body.coordinates;
    const category = req.body.category;

    Marker.create({
        name: name,
        coordinates: coordinates,
        category: category
    }, function (err, marker) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: marker });
    });
});

module.exports = router;

