const mongoose = require('mongoose');
const { Schema } = mongoose;

const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const toiletSchema = new Schema({
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
    },
    isDisabledToilet: {
        type: String,
        default: null
    }
});

toiletSchema.index({ coordinates: '2dsphere' });
toiletSchema.plugin(autoIncrement.plugin, {
    model: 'toilet',
    field: 'idx',
    startAt: 1, //시작
    increment: 1 // 증가
});

module.exports = mongoose.model('toilet', toiletSchema);
