const mongoose = require('mongoose');


const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: {
    type: Array,
    required: false
  },
  instructions: {
    type: Array,
    required: false
  },
  imageURL: {
    type: String,
    required: false,
    default: './defaultRecipe.jpg'
  },
  createdBy: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model('Recipes', recipeSchema);
