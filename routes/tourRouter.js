'use-strict';

// ---- All requires ----
const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// This param middle ware is basically for checking the id if it is valid or not.
// If the id is not valid then the middleWare function will returns. And don't return any data.
router.param('id', tourController.checkId);

// The checkBody middleWare is for checking the request if that is valid request or an invalid request.
// If that is an invalid request then it return a response with 400 error code (bad request).
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.addNewTour);
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
