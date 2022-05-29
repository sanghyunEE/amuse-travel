const mongoose = require('mongoose');
const { Schema } = mongoose;

const linestringSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    geo: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            default: "LineString"
        },
        coordinates: {
            type: Array,
            required: true
            //index: true
        }
    },
    category: {
        type: String,
        required: true
    }
});

linestringSchema.index({ geo: '2dsphere' });

const LineString = mongoose.model('linestring', linestringSchema);
module.exports = LineString;