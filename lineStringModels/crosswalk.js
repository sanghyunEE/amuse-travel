const mongoose = require('mongoose');
const { Schema } = mongoose;

const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const crosswalkSchema = new Schema({
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
    length: {
        type: Number,
        default: null
    }

});

crosswalkSchema.index({ geo: '2dsphere' });
crosswalkSchema.plugin(autoIncrement.plugin, {
    model: 'crosswalk',
    field: 'idx',
    startAt: 1, //시작
    increment: 1 // 증가
});

module.exports = mongoose.model('crosswalk', crosswalkSchema);
