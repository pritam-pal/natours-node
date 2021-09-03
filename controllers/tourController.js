const Tour = require('../models/tourModel');

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
    // ---- Building Query ----
    //  1.1 Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //  1.2 Advance filtering
    // Converting object to json string
    let queryStr = JSON.stringify(queryObj);
    // Replacing gte, gt, lte, lt with $gte, $gt, $lte, $lt
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Converting back to JS object
    let query = Tour.find(JSON.parse(queryStr));

    // NOTE ----
    // OR
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //  2. Sorting query
    if (req.query.sort) {
      // NOTE: First of all getting the sort from req obj, then split the string by "," and then join them by space
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // If sort is not exist in the url then the latest shown first
      query = query.sort('-createdAt');
    }

    // 3. Limiting Fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4. Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      // countDocuments() automatically counts number of documents in a collection
      const numTours = await Tour.countDocuments();
      if (numTours <= skip) throw new Error('This page dose not exist');
    }

    // Executing query
    const tours = await query;

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
