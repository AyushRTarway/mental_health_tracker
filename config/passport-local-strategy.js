const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (request, email, password, done) {
      //find a user and establish the identity
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          request.flash("error", err);
          return done(err);
        }
        if (!user || user.password != password) {
          request.flash("error", "Invlaid Username/Password");
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding the user-->Passport");
      return done(err);
    }
    return done(null, user);
  });
});

//check if the user is authenticated
passport.checkAuthentication = function (request, response, next) {
  //if the user is signed in,then pass on the request to the next function(controller's action)
  if (request.isAuthenticated()) {
    return next();
  }
  // if the user is not singed in
  return response.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (request, response, next) {
  if (request.isAuthenticated()) {
    //request.user contains the current signed in user from the session cookies
    //we are just sending this to the locals for the views
    response.locals.user = request.user;
  }
  next();
};

module.exports = passport;
