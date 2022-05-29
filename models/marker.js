const mongoose = require('mongoose');
const { Schema } = mongoose;

const markerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: true
        //index: true
    },
    category: {
        type: String,
        required: true
    }
});

markerSchema.index({ coordinates: '2dsphere' });


const Marker = mongoose.model('Marker', markerSchema);
module.exports = Marker;