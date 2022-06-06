const mongoose = require('mongoose');
const { Schema } = mongoose;

const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);


const overpassSchema = new Schema({
    idx: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        default: null
    },
    serialNumber: {
        type: Number,
        default: null
    },
    geo: {
        type: {
            type: String,
            default: "LineString"
        },
        coordinates: {
            type: Array,
            required: true
        }
    },
    width: {
        type: Number,
        default: null
    },
    height: {
        type: Number,
        default: null
    },
    length: {
        type: Number,
        default: null
    }

});

overpassSchema.index({ geo: '2dsphere' });
overpassSchema.plugin(autoIncrement.plugin, {
    model: 'overpass',
    field: 'idx',
    startAt: 1, //시작
    increment: 1 // 증가
});


module.exports = mongoose.model('overpass', overpassSchema);
