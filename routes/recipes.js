const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipes')

//Getting All
router.get('/', async (req, res)=> {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  }catch(err) {
    res.status(500).json({ message: err.message });
  }
})
//Getting one
router.get('/:id', getRecipe, (req, res) => {
  res.send(req.params.id);
})
//Creating one
router.post('/', (req, res) => {
  const subscriber = new Subscriber({
  })
})
//Updating one
router.patch('/:id', (req, res) => {

})
//Deleting one
router.delete('/:id', (req, res) => {

})

module.exports = router;
