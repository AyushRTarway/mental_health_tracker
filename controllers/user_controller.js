const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = function (req, res) {
  //without the async await
  User.findById(req.params.id, function (err, user) {
    return res.render("users_profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

//render the sign in page
module.exports.signUp = function (request, response) {
  if (request.isAuthenticated()) {
    return response.redirect("/users/home");
  }
  return response.render("sign-up", {
    title: "Sign Up",
  });
};

//render the sign up page
module.exports.signIn = function (request, response) {
  if (request.isAuthenticated()) {
    return response.redirect("/users/home");
  }

  return response.render("sign-in", {
    title: "Sign In",
  });
};

//get the sign up date
module.exports.create = function (request, response) {
  if (request.body.password != request.body.confirm_password) {
    return response.redirect("back");
  }
  User.findOne({ email: request.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing up ");
      return;
    }

    if (!user)
    {
      console.log(request.body);
      User.create(
        {
          email: request.body.email,
          phone: request.body.phone,
          name: request.body.name,
          password: request.body.password
        },
        function (err, user) {
          if (err) {
            console.log("error in creating user while signing up ");
            return;
          }

          return response.redirect("/users/sign-in");
        }
      );
    } else {
      return response.redirect("back");
    }
  });
};

//get the sign in and create a session for the user
module.exports.createSession = function (request, response) {
  request.flash("success", "Logged-in Successfully!");
  return response.redirect("/");
};

module.exports.destroySession = function (request, response) {
  request.logout(request.user, (err) => {
    if (err) {
      res.redirect("/");
    }
  });
  request.flash("success", "You have logged out!");
  return response.redirect("/");
};
