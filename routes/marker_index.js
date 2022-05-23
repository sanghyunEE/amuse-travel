const express = require('express');
const router = express.Router();
const Marker = require('../models/marker') // model require

/*
result = {
  result:{
    name = markers.name
  }
}
*/

// API 1.1
// 모든 마커 정보 조회 API
// GET - /markers
router.get('/', function (req, res) {
    Marker.find({}, function (err, markers) {
        if (err) return res.status(500).send({ error: err });
        const resultList = markers.map(x => {
            return {
                name: x.name,
                coordinates: x.coordinates,
                category: x.category
            }
        })
        res.json({ result: resultList });
    });
});


// API 1.2.1 - 수정 중
// 특정 좌표에 대한 근처 좌표 리스트(가까운 순으로) 조회 API
// GET - /markers/near -> POST 로 바뀌어서 req 에 특정 좌표값이 들어가야겠죠.
// MAXIMUM 개수 줄수 있음. 
router.get('/near', function (req, res) {
    Marker.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [127, 37]
                },
                distanceField: "dist.calculated",
                spherical: true
            }
        }
    ], function (err, markers) {
        if (err) return res.status(500).send({ error: err });
        res.json(markers);
    });
});


// API 1.2
// GET - /markers/near?lon=&lat=
// GET - /markers/near?a=38.9419+-78.3020 -> /markers/naer?a=
// GET - /markers/:markerId/near or /markers/near/:markerId
// :markerId 는 클라이언트가 줘야하며, 그 markerId는 
// 백엔드 의 특정 marker의 Id를 반환하는 API로 클라에게 전달 되는 것.
router.get('/near', function (req, res) {
    const longitude = req.query.lon;
    const latitude = req.query.lat;
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
        }
    ], function (err, markers) {
        if (err) return res.status(500).send({ error: err });
        res.json(markers);
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



// API .4
// 특정 좌표로 부터 n km 이내에 있는 좌표점들 모두 출력
// GET - /markers/within
router.get('/within/radius', function (req, res) {
    Marker.find({
        coordinates: {
            $geoWithin: {
                $centerSphere: [[127, 37.0001], 5 / 6378.1] // 5 / 6378.1 -> km radius / 10 / 3963.2 -> mile radius
            }
        }
    }, function (err, markers) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: markers });
    });
});

//API .4.1
// GET - /markers/within/radius?lon=&lat=&rad=
router.get('/within/radius', function (req, res) {
    const longitude = req.query.lon;
    const latitude = req.query.lat;
    const radius = req.query.rad;
    Marker.find({
        coordinates: {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], radius / 6378.1] // 5 / 6378.1 -> km radius / 10 / 3963.2 -> mile radius
            }
        }
    }, function (err, markers) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: markers });
    });
});

// API .5
router.get('/within/box', function (req, res) {
    console.log(req.query.a);
    Marker.find({
        coordinates: {
            $geoWithin: {
                $box: [[127.1, 37.1], [127.3, 37.3]]
            }
        }
    }, function (err, markers) {
        if (err) return res.status(500).send({ error: err });
        res.json({ result: markers });
    });
});


module.exports = router;


// module.exports = function (app, Marker) {

//   // Get All Markers
//   app.get('/api/markers', function (req, res) {
//     Marker.find({}, function (err, markers) {
//       if (err) return res.status(500).send({ error: 'database failure' });
//       res.json(markers);
//     });
//   });

//   // Get near Markers by specific marker
//   app.get('/api/near-markers', function (req, res) {
//     Marker.aggregate([
//       {
//         $geoNear: {
//           near: {
//             coordinates: [127, 37]
//           },
//           distanceField: "dist.calculated",
//           spherical: true
//         }
//       }], function (err, markers) {
//         if (err) return res.status(500).send({ error: 'database failure' });
//         res.json(markers);
//       });
//   });


//   // Create Marker
//   app.post('/api/markers', function (req, res) {
//     var marker = new Marker();
//     marker.name = req.body.name;
//     marker.coordinates = req.body.coordinates;
//     marker.category = req.body.category;

//     marker.save(function (err) {
//       if (err) {
//         console.error(err);
//         res.json({ result: 0 });
//         return;
//       }

//       res.json({ result: 1 });

//     });
//   });



// }