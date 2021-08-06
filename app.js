'use strict'

// ---- All requires ----
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

// ---- Using express ----
const app = express();

// ---- MiddleWares ----

// Using morgan MiddleWare for logging data
app.use(morgan('dev'));
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

app.use((req, res, next) => {
  console.log('Hello from the middle ware');
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// Using MiddleWares for mounting routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app;