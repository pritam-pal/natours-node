'use-strict';

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// console.log(process.env);
const app = require('./app');

// ---- Configuring Database and Connections ----

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database connection successful!');
  });

// ---- Schema for a Database ----
// By using new mongoose.Schema we are basically creating a blueprint of our data and some validation stuff
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: [true, 'A tour name must be unique'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    require: [true, 'A tour must have a price'],
  },
});

// By using mongoose.model we are basically creating a instance for our schema
const Tour = mongoose.model('Tour', tourSchema);

// Creating a new document out of Tour Schema
const testTour = new Tour({
  name: 'The Park Camper',
  rating: 4.5,
  price: 497,
});

// Saving newly created document to database
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(`Error 🤬 ${err}`);
  });

// ---- Booting Server ----

// Server Listening on port 3000 on localhost
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
