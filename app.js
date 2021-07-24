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

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours
    }
  })
})

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

const port = 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})