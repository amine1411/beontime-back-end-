var express = require("express");
var router = express.Router();
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (
      !checkBody(req.body, [
        "username",
        "password",
        "nom",
        "prenom",
        "picture",
        "isManager",
        "isCollab",
        "isWorking",
      ])
    ) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // Creation du User
    User.findOne({ username: req.body.username }).then((data) => {
      if (data === null) {
        // si User n'existe pas alors on va le créer
        const hash = bcrypt.hashSync(req.body.password, 10);
        // password: hash,
        const newUser = new User({
          username: req.body.username,
          password: req.body.password,
          token: uid2(32),
          nom: req.body.nom,
          prenom: req.body.prenom,
          picture: req.body.picture,
          isManager: req.body.isManager,
          isCollab: req.body.isCollab,
          isWorking: req.body.isWorking,
        });

        newUser.save().then((newUser) => {
          res.status(200).json({ result: true, token: newUser.token });
        });
      } else {
        // User already exists in database
        res.status(200).json({ result: false, error: "User already exists" });
      }
    });
  } catch (err) {
    return next(err);
  }
  //////////////
});

router.post("/signin", (req, res, next) => {
  //////////////
  try {
    // Vérification des parametres
    if (!checkBody(req.body, ["username", "password"])) {
      res.status(200).json({ result: false, error: "Missing or empty fields" });
      return;
    }

    // Vérification du user et comparaison du pwd
    // (user && bcrypt.compareSync(req.body.password, user.password))
    User.findOne({
      username: req.body.username,
      password: req.body.password,
    }).then((user) => {
      if (user) {
        res.status(200).json({ result: true, token: user.token });
      } else {
        res
          .status(200)
          .json({ result: false, error: "User not found or wrong password" });
      }
    });
  } catch (err) {
    return next(err);
  }
  //////////////
});

// getAllUsers
router.get("/all", (req, res, next) => {
  //////////////
  try {
    // Lecture des users
    User.find()
      .select({ _id: 0, __v: 0, token: 0, password: 0 })
      .then((data) => {
        if (data.length !== 0) {
          res.status(200).json({ result: true, users: data });
        } else {
          // il n'y a pas de clients
          res.status(200).json({ result: false, error: "No Users in DB" });
        }
      });
  } catch (err) {
    return next(err);
  }
  //////////////
});

module.exports = router;
