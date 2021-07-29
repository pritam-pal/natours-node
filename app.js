const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200)
//   .json({m: 'Response'})

// })

// app.post('/', (req, res) => {
//   res.send('App is running on port 3000')
// })
// const port = 3000;
// app.listen(port, () => {
//   console.log(`App is running on port ${port}`);
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));




// Get all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours
    }
  })
})

// Adding a new tour
app.post('/api/v1/tours', (req, res) => {
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
})

// Gat parameters from the url and use them
app.get('/api/v1/tours/:id', (req, res) => {
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
})

// patch request
app.patch('/api/v1/tours/:id', (req, res) => {
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
})

// Delete
app.delete('/api/v1/tours/:id', (req, res) => {
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
})

const port = 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})