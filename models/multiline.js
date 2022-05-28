const mongoose = require('mongoose');
const { Schema } = mongoose;

const multilineSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    geo: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            default: "MultiLineString"
        },
        coordinates: {
            type: Array,
            required: true,
        }
    },
    category: {
        type: String,
        default: "PolyLine"
    }
});

const MultiLineString = mongoose.model('multiline', multilineSchema);
module.exports = MultiLineString;