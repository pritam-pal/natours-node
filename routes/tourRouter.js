'use-strict';

// ---- All requires ----
const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// NOTE:
// This param middle ware is basically for checking the id if it is valid or not.
// If the id is not valid then the middleWare function will returns. And don't return any data.
// router.param('id', tourController.checkId);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
