//DEPENDENCIES SET-UP
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const session = require("express-session");
const methodOverride = require("method-override");
// const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/dataHeist";

//DATA/ QUESTIONS CONNECTION
const fact = require("./models/factSheet.js");
const User = require("./models/userInput.js");

//MIDDLEWARE
//BODY-PARSER MIDDLEWARE
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
//^ will take incoming strings from the body that are url encoded and parse them into an object
app.use(express.json());
//STATIC FILES MIDDLEWARE
app.use(express.static(__dirname + "/public"));

//ROUTES
//GET INDEX - GET IS THE ONLY ROUTE THAT INTERACTS WITH HTML (1/7)
app.get("/", (req, res) => {
  res.render("index.ejs");
});

//SHOW SOURCES IN SOURCES.EJS
app.get("/sources", (req, res) => {
  res.render("sources.ejs");
});

//SHOW FUNFACTS.EJS (2/7)
app.get("/facts", (req, res) => {
  res.render("facts.ejs", {
    facts: fact
  });
});

//GET AND SHOW ME THE NEW.EJS FORM
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

//SHOW EDIT FORM
app.get("/new/edit", (req, res) => {
  res.render("edit.ejs");
});
//POST SUBMISSION OF EDIT FORM (POST DOES NOT TOUCH HTML)
app.post("/new/edit", (req, res) => {
  res.redirect("/new/edit");
});

//GET RESULTS.EJS
// app.get("/results", (req, res) => {
//   res.render("results.ejs");
// });

//GET RESULTS.EJS index
app.get("/results/:id", (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    res.render("results.ejs", {
      user: foundUser
    });
  });
});

//CREATE (5/7) **HELP**
app.post("/results", (req, res) => {
  if (req.body.https === "on") {
    res.body.https = true;
  } else {
    req.body.https = false;
  }
  //USE SCHEMA WHEN POSTING TO DB
  User.create(req.body, (error, createUser) => {
    if (error) {
      res.send(error);
    } else {
      console.log(createUser.id);
      res.redirect(`/results/${createUser.id}`);
    }
  });
});

//UPDATE
app.put("", (req, res) => {});

//DELETE
app.delete("", (req, res) => {});

//LISTENER
app.listen(port, () => {
  console.log("Listening on port: ", port);
});

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once("open", () => {
  console.log("Connected to Mongo!");
});
