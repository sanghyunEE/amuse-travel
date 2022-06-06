const mongoose = require('mongoose');
const { Schema } = mongoose;

const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);


const sidewalkSchema = new Schema({
    idx: {
        type: Number,
        default: 0
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
    slope: {
        type: Number,
        default: null
    },
    length: {
        type: Number,
        default: null
    }

});

sidewalkSchema.index({ geo: '2dsphere' });
sidewalkSchema.plugin(autoIncrement.plugin, {
    model: 'sidewalk',
    field: 'idx',
    startAt: 1, //시작
    increment: 1 // 증가
});


module.exports = mongoose.model('sidewalk', sidewalkSchema);
