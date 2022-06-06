const mongoose = require('mongoose');
const { Schema } = mongoose;

const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const stepSchema = new Schema({
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
    stepHeight: {
        type: Number,
        default: null
    }
});

stepSchema.index({ coordinates: '2dsphere' });
stepSchema.plugin(autoIncrement.plugin, {
    model: 'step',
    field: 'idx',
    startAt: 1, //시작
    increment: 1 // 증가
});

module.exports = mongoose.model('step', stepSchema);
