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

//ROUTES =========================================================
//GET INDEX - GET IS THE ONLY ROUTE THAT INTERACTS WITH HTML
app.get("/", (req, res) => {
  res.render("index.ejs");
});

//SHOW SOURCES IN SOURCES.EJS
app.get("/sources", (req, res) => {
  res.render("sources.ejs");
});

//SHOW FUNFACTS.EJS
app.get("/facts", (req, res) => {
  res.render("facts.ejs", {
    facts: fact
  });
});

//HOW ME THE NEW.EJS FORM
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

//SHOW EDIT FORM
app.get("/show/:id/edit", (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      res.render("edit.ejs", {
        User: foundUser
      });
    }
  });
});
// //POST SUBMISSION OF EDIT FORM (POST DOES NOT TOUCH HTML)
// app.post("/new/edit", (req, res) => {
//   res.redirect("/new/edit");
// });

// GET RESULTS.EJS (ALL)
app.get("/results", (req, res) => {
  User.find({}, (error, allUsers) => {
    if (error) {
      res.send(error);
    } else {
      res.render("results.ejs", {
        User: allUsers
      });
    }
  });
});
//POST ALL RESULTS
app.post("/results", (req, res) => {
  //USE SCHEMA WHEN POSTING TO DB
  //HTTPS IF STATEMENT
  if (req.body.https === "on") {
    req.body.https = true;
  } else {
    req.body.https = false;
  }
  //PASSWORD IF STATEMENT
  if (req.body.passwordSafe === "on") {
    req.body.passwordSafe = true;
  } else {
    req.body.passwordSafe = false;
  }
  //VPN IF STATEMENT
  if (req.body.useVPN === "on") {
    req.body.useVPN = true;
  } else {
    req.body.useVPN = false;
  }
  User.create(req.body, (error, createUser) => {
    if (error) {
      res.send(error);
    } else {
      // res.send(createUser);
      res.redirect("/results");
    }
  });
});

//GET RESULTS.EJS BY ID
app.get("/show/:id", (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    res.render("show.ejs", {
      User: foundUser
    });
  });
});

//GET RESULTS (USERS BY ID)
app.post("/show", (req, res) => {
  if (req.body.https === "on") {
    res.body.https = true;
  } else {
    req.body.https = false;
  }
  User.create(req.body, (error, createUser) => {
    if (error) {
      res.send(error);
    } else {
      console.log(createUser.id);
      res.redirect(`/show/${createUser.id}`);
    }
  });
});

//PUT ROUTE TO UPDATE
app.put("/show/:id", (req, res) => {
  //   //HTTPS IF STATEMENT
  if (req.body.https === "on") {
    req.body.https = true;
  } else {
    req.body.https = false;
  }
  //PASSWORD IF STATEMENT
  if (req.body.passwordSafe === "on") {
    req.body.passwordSafe = true;
  } else {
    req.body.passwordSafe = false;
  }
  //VPN IF STATEMENT
  if (req.body.useVPN === "on") {
    req.body.useVPN = true;
  } else {
    req.body.useVPN = false;
  }
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedUserInput) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/results");
      }
    }
  );
});

//DELETE
app.delete("/show/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, deleteUserInput) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/results");
    }
  });
});

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
