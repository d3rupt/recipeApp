const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
const Subscriber = require('./models/subscribers')
passport.use(new LocalStrategy(Subscriber.authenticate()));

function initialize(passport ,getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    user = getUserByEmail(email);
    if (user == null) {
      return done(null , false, { message: 'No user with that email' });
    }
  try {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Password incorrect" });
    }
  } catch(e) {
    return done(e);
  }
  }
  //passport.use(new LocalStrategy(Subscriber.authenticate()));
  passport.serializeUser(Subscriber.serializeUser());
  passport.deserializeUser(Subscriber.deserializeUser());
}

module.exports = initialize;
