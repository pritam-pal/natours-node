'use-strict';

const mongoose = require('mongoose');
const Slugify = require('slugify');

// ---- Schema for a Database ----
// By using new mongoose.Schema we are basically creating a blueprint of our data and some validation stuff
const tourSchema = new mongoose.Schema(
  {
    // Schema
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: [true, 'A tour name must be unique'],
      trim: true,
      minlength: [10, 'A tour must have 10 or more character'],
      maxlength: [40, 'A tour must have less or equal to 40 character'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // The enum validator is only work with strings
      enum: {
        value: ['easy', 'medium', 'difficult'],
        message: 'Difficulty ether easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      // The min and max validator not only work with numbers, it also work with dates
      min: [1, 'Rating must be grater or equal to 1.0'],
      max: [5, 'Rating must be less or equal to 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // Custom validator
      validate: {
        validator: function (val) {
          // Hear this keyword only point to current doc or new document. It will not work with update.
          return val < this.price;
        },
        message: 'The price discount ({VALUE}) must be less then regular price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a description'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretTour: Boolean,
    startDates: [Date],
  },
  {
    // Options
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---- Virtual Property ----
// NOTE: Virtual properties can't be queried, because they are not stored in the database

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// ---- Document Middleware ----
// The 'save' hook only work with the .save() , .create() functions, it doesn't work with insertMany
// NOTE:  We can define as many pre & post middleware as we want with the same hook. Hare the hook is 'save'.

tourSchema.pre('save', function (next) {
  // This pre middleware has access to the document before it saves on database
  this.slug = Slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('This is a pre middleware');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   // This post middleware functions are executed after the pre middleware functions completed
//   console.log(doc);
//   next();
// });

// ---- Query Middleware ----

tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query completed ${Date.now() - this.start} milliseconds`);
  next();
});

// ---- Aggregation Middleware ----

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// By using mongoose.model we are basically creating a instance for our schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
