const express = require('express');
const router = express.Router();
const BikeData = require('../models/BikeData');
const mongoose = require('mongoose')
// GET-getting datas from DB
router.route('/get').get((req, res) => {
    BikeData.find()
      .then(data => res.json(data))
      .catch(error => res.status(500).json({ error: 'An error occurred while fetching data' }));
  });
  router.route('/data').get((req, res) => {
    BikeData.find()
      .then(data => res.json(data))
      .catch(error => res.status(500).json({ error: 'An error occurred while fetching data' }));
  });


  // Post- To send Bike Data 
router.route('/addbike').post(async (req, res) => {
    const { make,model, year, mileage,rentperhour,type,description, imagelink } = req.body;
  
    try {
      const data = new BikeData({ make,model, year, mileage,rentperhour,type,description,imagelink});
      console.log(data);
      data.save();
      res.status(201).send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error occurred while hashing the password');
    }
  });
  // PUT- Updating Existing data
  router.put('/:id', async (req, res) => {
    try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);

        if (!isValidObjectId) {
            return res.status(400).json({ error: 'Invalid ObjectId' });
        }

        const updatedbikelist = await BikeData.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedbikelist) {
            return res.status(404).json({ error: 'Bike not found' });
        }

        res.json(updatedbikelist);
    } catch (error) {
        console.error('Error updating BikeList:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Delete- deleting the data
router.delete('/:id', async (req, res) => {
  try {
    await BikeData.findByIdAndDelete(req.params.id);
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  module.exports= router