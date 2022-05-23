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
    required: true,
    unique: true,
    index: true
  },
  category: {
    type: String,
    required: true
  }
});

markerSchema.index({ coordinates: '2dsphere' }, { unique: true });


const Marker = mongoose.model('Maker', markerSchema);
module.exports = Marker;