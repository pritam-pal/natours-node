'use-strict';
// ---- All requires ----
const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();

router.route('/').get(tourController.getAllTours).post(tourController.addNewTour);
router.route('/:id').get(tourController.getTourById).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;