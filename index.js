const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const port = 5000;
// used for cookie-session
const session = require('express-session')
const passport = require('passport');
const passportlocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customware = require("./config/middleware");

app.use(
  session({
    name: "codeial",
    //todo change the secret before deployment in production mode
    secret: "mental_health_tracker",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
    store: new MongoStore(
      { mongoUrl: "mongodb://0.0.0.0/confidential" },
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(express.urlencoded());//to read url encoded
app.use(cookieParser());
// use express router
app.use(express.static('./assests'));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customware.setflash); 

app.use("/", require("./routes/index"));

app.listen(port, function (err)
{
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
}); 
