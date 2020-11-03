const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const subscriberSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  recipes: {
    type: Array,
    required: false
  },
  dateSubscribed: {
    type: Date,
    default: Date.now
  }

})
subscriberSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Users', subscriberSchema);
