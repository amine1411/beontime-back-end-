const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: String,
    token: String,
    password: String,
    nom: String,
    prenom: String,
    picture: String,
    isManager: Boolean,
    isCollab: Boolean,
    isWorking: Boolean,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
