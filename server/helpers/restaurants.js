const { Restaurant } = require('../models/restaurant');

const daysEnum = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const processBusinessHours = (businessHoursArray) => {
  return businessHoursArray[0]?.open.map((entry) => ({
    day: daysEnum[entry.day], // Map day from 0–6 to custom string
    start: entry.start,
    end: entry.end,
  }));
};

const processDisplayAddress = (displayAddressArray) => {
  return displayAddressArray.join(', ');
};

const processYelpData = async (yelpData) => {
  try {
    const restaurants = await Promise.all(
      yelpData.businesses.map(async (business) => {
        const restaurant = {
          business_id: business.id,
          name: business.name,
          image_url: business.image_url,
          url: business.url,
          review_count: business.review_count,
          rating: business.rating,
          coordinates: {
            latitude: business.coordinates.latitude,
            longitude: business.coordinates.longitude,
          },
          display_address: processDisplayAddress(
            business.location.display_address
          ),
          business_hours: processBusinessHours(business.business_hours),
        };

        // Check if restaurant already exists in the database - consider performance more
        const existing = await Restaurant.findOne({
          business_id: restaurant.business_id,
        });
        if (!existing) {
          const newRestaurant = new Restaurant(restaurant);
          await newRestaurant.save();
          return newRestaurant;
        } else {
          return existing;
        }

        // const newRestaurant = new Restaurant(restaurant);
        // await newRestaurant.save();
        // return newRestaurant;
      })
    );

    return {
      restaurants: restaurants,
      center: yelpData.region.center,
    };
  } catch (error) {
    console.error('Error processing Yelp data:', error);
    throw new Error('Failed to process Yelp data');
  }
};

module.exports = { processYelpData };
