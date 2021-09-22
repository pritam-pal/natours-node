'use-strict';

// ---- All requires ----
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

// ---- Using express ----
const app = express();

// ---- MiddleWares ----

// Using static for serving static files in express
app.use(express.static(`${__dirname}/public/`));
// Using morgan MiddleWare for logging data
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// MiddleWare to use json function in express
app.use(express.json());

// ---- Custom MiddleWares ----
/*
  ---- Notes ----
  1. We need to use middle wares before request, response cycle end's ( route() function ).
  2. Must call next() function to goto the next middle wares.
  3. We can update or add properties to the request object through middle wares.
  4. Can be create as many as we want.
  ---- O ----
*/

// Using use MiddleWares for mounting routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// All unhandled routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // Creating an error for all unhandled routes
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  // If we pass an argument in a next function express automatically considered that as an error.
  next(err);
});

// Error handling middleware
// A error handling middleware should start with a err parameter
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
module.exports = app;
