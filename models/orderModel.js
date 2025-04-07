const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cart',
    required: [true, 'Booking must belong to a cart!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: false
  }
});
// pre make order when every any find 
orderSchema.pre(/^find/, function(next) {
  this.populate('user').populate('cart');
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
