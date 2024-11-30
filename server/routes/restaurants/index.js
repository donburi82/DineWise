require('dotenv').config();

const express = require('express');
const axios = require('axios');
const router = express.Router();

const { processYelpData } = require('../../helpers/restaurants');

const YELP_API_KEY = process.env.API_KEY;
const yelpClient = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    Authorization: `Bearer ${YELP_API_KEY}`,
  },
});

router.post('/textsearch', async (req, res) => {
  const { latitude, longitude, term, price_range, open_now } = req.body;

  try {
    const response = await yelpClient.get('/businesses/search', {
      params: {
        latitude: latitude,
        longitude: longitude,
        term: term,
        price: price_range,
        open_now: open_now,
        // fixed
        // term: 'restaurants',
        radius: 700,
        limit: 20,
        sort_by: 'distance',
      },
    });

    // parse and save to Restaurants
    const result = await processYelpData(response.data);

    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    console.error('Error fetching data from Yelp:', error);
    res
      .status(500)
      .json({ status: 'error', msg: 'Failed to fetch data from Yelp' });
  }
});

router.post('/categorysearch', async (req, res) => {
  const { latitude, longitude, category } = req.body;

  try {
    const response = await yelpClient.get('/businesses/search', {
      params: {
        latitude: latitude,
        longitude: longitude,
        categories: category,
        // fixed
        term: 'restaurants',
        radius: 700,
        limit: 20,
        sort_by: 'distance',
      },
    });

    // parse and save to Restaurants
    const result = await processYelpData(response.data);

    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    console.error('Error fetching data from Yelp:', error);
    res
      .status(500)
      .json({ status: 'error', msg: 'Failed to fetch data from Yelp' });
  }
});

module.exports = router;
