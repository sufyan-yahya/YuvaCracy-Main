const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    email: {type: String, unique: true, require: true},
  },
  {
    collection: "Users",
  }
);

mongoose.model("Users", UserDetailsScehma);
