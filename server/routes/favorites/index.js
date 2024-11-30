const express = require('express');
const { ObjectId } = require('mongodb');
const { User } = require('../../models/user');
const { Restaurant } = require('../../models/restaurant');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ _id: new ObjectId(userId) }).populate(
      'favorites'
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ status: 'success', data: user.favorites });
  } catch (error) {
    res.status(400).json({ status: 'error', msg: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const restaurantId = req.body.restaurantId;
    const restaurant = await Restaurant.findOne({ business_id: restaurantId });

    const isAlreadyFavorite = user.favorites.some(
      (fav) => fav.toString() === restaurant._id.toString()
    );
    if (isAlreadyFavorite) {
      throw new Error('Restaurant already in favorites');
    }

    user.favorites.push(restaurant._id);
    await user.save();

    res
      .status(200)
      .json({ status: 'success', msg: 'Restaurant added to favorites' });
  } catch (error) {
    res.status(400).json({ status: 'error', msg: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
    const user = await User.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const restaurantId = req.body.restaurantId;
    const restaurant = await Restaurant.findOne({ business_id: restaurantId });

    const isFavorite = user.favorites.some(
      (fav) => fav.toString() === restaurant._id.toString()
    );
    if (!isFavorite) {
      return res.status(400).json({ error: 'Restaurant is not in favorites' });
    }

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== restaurant._id.toString()
    );
    await user.save();

    res.status(200).json({
      status: 'success',
      msg: 'Restaurant removed from favorites',
    });
  } catch (error) {
    res.status(400).json({ status: 'error', msg: error.message });
  }
});

module.exports = router;
