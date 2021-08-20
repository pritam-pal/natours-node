'use-strict';

const mongoose = require('mongoose');

// ---- Schema for a Database ----
// By using new mongoose.Schema we are basically creating a blueprint of our data and some validation stuff
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: [true, 'A tour name must be unique'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// By using mongoose.model we are basically creating a instance for our schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
