const fs = require('fs');
const express = require('express');
const app = express();

// Middle Ware
app.use(express.json());

// Reading json file when server starts
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// All Route functions
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
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

// All Routs
// Get all tours
app.get('/api/v1/tours', getAllTours);
// Adding a new tour
app.post('/api/v1/tours', addNewTour);
// Gat parameters from the url and use them
app.get('/api/v1/tours/:id', getTourById);
// patch request
app.patch('/api/v1/tours/:id', updateTour);
// Delete
app.delete('/api/v1/tours/:id', deleteTour);

// Server Listen on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})