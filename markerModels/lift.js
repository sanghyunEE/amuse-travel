const mongoose = require('mongoose');
const { Schema } = mongoose;

const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const liftSchema = new Schema({
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

liftSchema.index({ coordinates: '2dsphere' });
liftSchema.plugin(autoIncrement.plugin, {
    model: 'lift',
    field: 'idx',
    startAt: 1, //시작
    increment: 1 // 증가
});

module.exports = mongoose.model('lift', liftSchema);
