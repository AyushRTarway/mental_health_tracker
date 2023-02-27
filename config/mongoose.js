// require the library

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
//connect to the database
// mongoose.connect('mongodb+srv://ayush:12345@cluster0.45c60ia.mongodb.net/?retryWrites=true&w=majority/contact_list_db');
mongoose.connect("mongodb://0.0.0.0:27017/mental_health"); //local host

//acquire the connection(to check if it's successful)
const db = mongoose.connection;

//error
db.on("error", function (err) {
  console.log(err.message);
});

//up and running then print the message
db.once("open", function () {
  console.log("Successfully connected to the database");
});

// module.exports=db;
