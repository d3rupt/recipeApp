  /*if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}*/
const bodyParser = require('body-parser');
const Subscriber = require('./models/subscribers')
const Recipe = require('./models/recipes');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('express-flash');
const session = require('express-session');
const express = require('express');
const app = express();
app.use(express.static('./views'));

let user;

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);


app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: 'fgfgdfg3fgfgsdfsdgsd5fsdfasfsdgsdv8scsdfsdgdvdfsd8vsdvdvdv',//process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.json())
//const recipesRouter = require('./routes/recipes');
//app.use('/recipes', recipesRouter);
//const subscribersRouter = require('./routes/recipes');
//app.use('/recipes', recipesRouter);

//, checkAuthenticated
app.get('/', async (req, res) => {
  console.log('Clicked');
  try {
    const recipes = await Recipe.find({createdBy: req.user._id});
    recipes.forEach(recipe => {
      })
    res.json(recipes);
  }catch(err) {
    res.status(500).json({message: "Not found"});
  }
})

app.get('/home', checkAuthenticated, async (req, res) => {
res.render('index.ejs');
})

//Login/Out and Register
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
})
app.post('/login', passport.authenticate('local',
 { failureRedirect: '/login', failureFlash: true }), function(req, res) {
    res.redirect('/home');
    console.log(`${req.user.username} just logged in.`);
  });

  app.delete('/logout', (req, res) => {
    console.log(`${req.user.username} logged out.`);
    req.logOut();
    res.redirect('/login');
  })

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
})

app.post('/register', function(req, res) {
    Subscribers=new Subscriber({username: req.body.username, email: req.body.email});
    Subscriber.register(Subscribers, req.body.password, function(err, user) {
      if (err) {
        req.flash('message', err);
        res.redirect('/register');
      //  res.json({success:false, message:"Your account could not be saved. Error: ", err})
        console.log(err);
      }else{
        console.log(`${req.body.username} registered.`)
        //res.json({success: true, message: "Your account has been saved"})
        res.redirect('/home');
      }
    });
});

//Create one
app.get('/create', checkAuthenticated, (req, res) => {
  console.log('Accessed create page');
  res.render('create.ejs');
})
app.post('/create', async (req, res) => {
  Recipes = new Recipe({
    name: req.body.name,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    createdBy: req.user._id
  });
  let newRecipe1 = await Recipes.save();
  console.log(newRecipe1 + 'this is the new recipe');
  let recipeId = newRecipe1._id;
  let recipe = await Recipe.findOne({_id: recipeId});
  let uName = await Subscriber.findOneAndUpdate(
    {username: req.user},
    {$addToSet: {recipes: [recipeId]}},
    function(err, result) {
      if (err) {
        req.flash('message', error);
      } else {
        return res.redirect('/home');
      }
    }
  );

});

//Getting all
app.get('/')

//View a recipe
app.get('/view', (req, res) => {
  res.render('view.ejs')
})

//Get thisRecipeId
let thisRecipeId;
app.post('/recipeId', (req, res) => {
  thisRecipeId = req.body.id;
  console.log(thisRecipeId);
})

//Get recipe info
  let recipeResponse;
app.get('/getrecipe', async (req, res) => {
  console.log('accessed getrecipe');
  try {
    recipeResponse = await Recipe.findOne({_id: thisRecipeId});
    res.json(recipeResponse);
    console.log('Sent recipe');
} catch (err) {
  console.log(err);
}

})
//Getting one
/*app.get('/:id', getRecipe, (req, res) => {
  res.render('view.ejs');
})*/

//Edit a recipe
app.get('/edit', (req, res) => {
  console.log('rendered edits page');
  res.render('edit.ejs')
})
//Updating one
app.post('/edit', async (req, res) => {
  console.log('request body: ' + req.body);
/*  if (req.body.name != null) {
    recipe.name = req.body.name;
  }
  if (req.body.ingredients != null) {
    recipe.ingredients = req.body.ingredients;
  }
  if (req.body.instructions != null) {
    recipe.instructions = req.body.instructions;
  }
  if (req.body.imageURL != null) {
    recipe.imageUrl = req.body.imageUrl;
  }
  if (req.body.createdBy != null) {
    recipe.createdBy = req.body.createdBy;
  }*/
  try {
      const updatedRecipe = await Recipe.findOneAndUpdate(
      {_id: thisRecipeId},
      {name: req.body.name,
       ingredients: req.body.ingredients,
       instructions: req.body.instructions
    });
    console.log('Edited recipe');
    console.log(updatedRecipe);
    res.status(200).send();
  } catch (err) {
    console.log(err);
  }
})
//Deleting one
app.post('/delrecipe', async (req, res) => {
  console.log('received del request');
  recipe = req.body.id;
  try {
    await Recipe.deleteOne({_id: recipe});
    console.log('deleted');
    res.json({message: 'Deleted'});
  } catch (err) {
    console.log('not deleted');
    res.json({message: 'Not deleted'});
  }
});

let recipe;
async function getRecipe(req, res) {
  try {
     recipe = await Recipe.findById(thisRecipeId)
    if (recipe == null) {
      return res.status(404).json({message: "Can't find recipe"});
    }
  } catch (err) {
      return res.status(500).json({message: err.message});
  }
}

function checkAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login');
  }
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home');
  }
  next();
}

mongoose.connect('mongodb://localhost/recipes', { useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));

db.once('open', () => console.log('Database connected.'));
app.listen(8000, () => console.log('listening'));
