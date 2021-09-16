const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

// Aliasing Routes MiddleWare
// This middleware is for '/top-5-cheap' route and it auto compleat all fields for executing a query.
exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  req.query.fields = 'name, ratingsAverage, price, duration, summary';
  next();
};

// Tour Routs
exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    // const tour = await Tour.findOne({ _id: req.params.id })
    // OR
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: `Not found ${err}`,
    });
  }
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({})
  // newTour.save().then()

  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

// ---- AGGREGATION PIPELINE ----

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
