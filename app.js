'use strict'

// ---- All requires ----
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

// ---- Using express ----
const app = express();

// ---- MiddleWares ----

// Using morgan MiddleWare for login
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

// ---- Initial File Reads ----

// Reading json file when server starts
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// ---- All Route functions ----

// Tour Routs
const getAllTours = (req, res) => {
  console.log(req.requestTime)
  res.status(200).json({
    status: 'success',
    requestedTime: req.requestTime,
    result: tours.length,
    data: {
      tours
    }
  })
}

const addNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTours = Object.assign({ id: newId }, req.body);
  tours.push(newTours)
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tours: newTours 
      }
    })
  })
}

const getTourById =  (req, res) => {
  console.log(req.params)

  const tour = tours.find(el => el.id === Number(req.params.id))

  if(tours.length < req.params.id) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
}

const updateTour = (req, res) => {
  if(Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour is hear>'
    }
  });
}

const deleteTour =  (req, res) => {
  if(Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null
  })
}

// User Routs
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! 😅'
  })
}
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! 😅'
  })
}
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! 😅'
  })
}
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! 😅'
  })
}
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! 😅'
  })
}


// ---- All Routs (old code) ----

// Get all tours
// app.get('/api/v1/tours', getAllTours);
// Adding a new tour
// app.post('/api/v1/tours', addNewTour);
// Gat parameters from the url and use them
// app.get('/api/v1/tours/:id', getTourById);
// patch request
// app.patch('/api/v1/tours/:id', updateTour);
// Delete
// app.delete('/api/v1/tours/:id', deleteTour);


// ---- All Routs (new Code) ----

/*
// Using route methods to chaining all tour routs together
app.route('/api/v1/tours').get(getAllTours).post(addNewTour);
app.route('/api/v1/tours/:id').get(getTourById).patch(updateTour).delete(deleteTour);

// Using route methods to chaining all user routs together
app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

*/

// Updated version of routes using middle wares and Router express method

const tourRoute = express.Router();
const userRoute = express.Router();

tourRoute.route('/').get(getAllTours).post(addNewTour);
tourRoute.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

userRoute.route('/').get(getAllUsers).post(createUser);
userRoute.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// Using MiddleWares for mounting routes
app.use('/api/v1/tours', tourRoute)
app.use('/api/v1/users', tourRoute)

// ---- Booting Server ----

// Server Listening on port 3000 on localhost
const port = 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
