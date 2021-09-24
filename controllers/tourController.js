const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncError = require('../utils/catchAsyncError');

// Aliasing Routes MiddleWare
// This middleware is for '/top-5-cheap' route and it auto compleat all fields for executing a query.
exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  req.query.fields = 'name, ratingsAverage, price, duration, summary';
  next();
};

// Tour Routs
exports.getAllTours = catchAsyncError(async (req, res) => {
  // Executing query
  const features = new APIFeatures(Tour.find(), req.query)
    .filtering()
    .sorting()
    .limitingFields()
    .pagination()
    .filtering()
    .sorting();
  const tours = await features.query;

  // Sending response to the clint
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTourById = catchAsyncError(async (req, res) => {
  // const tour = await Tour.findOne({ _id: req.params.id })
  // OR
  const tour = await Tour.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsyncError(async (req, res) => {
  // const newTour = new Tour({})
  // newTour.save().then()

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tours: newTour,
    },
  });
});

exports.updateTour = catchAsyncError(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsyncError(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// ---- AGGREGATION PIPELINE ----

exports.getTourStats = catchAsyncError(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      // MATCH is basically for selecting a document. In this case with the ratingsAverage.
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      // By using group we can create a group of document
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsyncError(async (req, res) => {
  const year = Number(req.params.year);
  const plan = await Tour.aggregate([
    {
      // UNWIND pull single data out of an array, In this case pull dates from date array and display specifically
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      // addFields is basically for assigning a existing field to a new field
      $addFields: {
        months: '$_id',
      },
    },
    {
      // project is for display a field or hide a field
      $project: { _id: 0 },
    },
    {
      $sort: { numToursStarts: -1 },
    },
    {
      // limit is for limiting the number of results
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
