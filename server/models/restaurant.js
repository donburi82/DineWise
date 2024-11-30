const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  business_id: { type: String, unique: true },
  name: { type: String },
  image_url: { type: String },
  url: { type: String },
  review_count: { type: Number },
  rating: { type: Number },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  display_address: { type: String }, // e.g. "201 E 10th St, New York, NY 10003"
  business_hours: [
    {
      day: {
        type: String,
        enum: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
      },
      start: { type: String }, // e.g. "1700"
      end: { type: String }, // e.g. "2300"
    },
  ],
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = { Restaurant };
