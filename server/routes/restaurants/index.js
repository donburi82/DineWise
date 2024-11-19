require('dotenv').config();

const express = require('express');
const axios = require('axios');
const router = express.Router();
const YELP_API_KEY = process.env.API_KEY;

const yelpClient = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    Authorization: `Bearer ${YELP_API_KEY}`,
  },
});

router.get('/search', async (req, res) => {
  const { latitude, longitude, categories } = req.body;

  try {
    const response = await yelpClient.get('/businesses/search', {
      params: {
        latitude: latitude,
        longitude: longitude,
        categories: categories ? categories : null,
        // fixed
        radius: 500,
        term: 'restaurants',
        limit: 20,
      },
    });

    // parse if needed

    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error fetching data from Yelp:', error);
    res
      .status(500)
      .send({ status: 'error', msg: 'Failed to fetch data from Yelp' });
  }
});

router.get('/details', async (req, res) => {
  const { business_id } = req.query;
  console.log(business_id);

  try {
    const response = await yelpClient.get(`/businesses/${business_id}`);

    // parse if needed

    res.status(200).send(response.data);
  } catch (error) {
    console.error(
      'Error fetching data from Yelp:',
      error.response?.data || error.message
    );
    res
      .status(500)
      .send({ status: 'error', msg: 'Failed to fetch data from Yelp' });
  }
});

module.exports = router;
