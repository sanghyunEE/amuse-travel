const mongoose = require('mongoose');
const { Schema } = mongoose;

const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const parkingSchema = new Schema({
    idx: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

parkingSchema.index({ coordinates: '2dsphere' });
parkingSchema.plugin(autoIncrement.plugin, {
    model: 'parking',
    field: 'idx',
    startAt: 1, //시작
    increment: 1 // 증가
});

module.exports = mongoose.model('parking', parkingSchema);
