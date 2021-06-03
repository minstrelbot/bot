const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: String, required: true }, // id of user
  name: { type: String, default: "You" }, // character name
  pronoun: { type: String, default: "t" }, // one of he/him, they/them, she/her, shown as h, t, or s
  badges: { // list of badges unlocked, boolean for each
    test: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model(`${__filename.split(`${__dirname}/`).pop().split(`.`).shift()}`, schema);