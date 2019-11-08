//CONNECT MONGOOSE
const mongoose = require("mongoose");
//DEFINE TYPE MONGOOSE W/ CLASS OF SCHEMA
const Schema = mongoose.Schema;

//DEFINE SCHEMAS
const UserInput = Schema({
  site: { type: String },
  passwordSafe: { type: Boolean },
  https: { type: Boolean },
  useVNP: { type: Boolean },
  comment: { type: String }
});

const userInput = mongoose.model("UserInput", UserInput);

module.exports = userInput;
