const mongoose = require('mongoose')

// Define a schema for your data
const bikeDataSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: String,
    mileage: String,
    rentperhour: String,
    type: String,
    description: String,
    imagelink : String,
  });
  const BikeData = mongoose.model('BikeData', bikeDataSchema);

  module.exports =  BikeData