var express = require("express");
var router = express.Router();
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// signup - TEST OK
// Creation d'un Collaborateur
router.post("/signup", (req, res, next) => {
  console.log("signup/collab pour le req.body =>", req.body);

  try {
    // Verification des parametres du body
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

        // password: hash,
        const hash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
          username: req.body.username,
          password: hash,
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
        res
          .status(200)
          .json({ result: false, error: "Collaborateur existe deja" });
      }
    });
  } catch (err) {
    return next(err);
  }
}); // fin signup

// signin - TEST OK
// Connexion d'un Collaborateur
router.post("/signin", (req, res, next) => {
  try {
    // Vérification des parametres
    if (!checkBody(req.body, ["username", "password"])) {
      res.status(200).json({ result: false, error: "Missing or empty fields" });
      return;
    }

    // Vérification du user et comparaison du pwd
    User.findOne({
      username: req.body.username,
    }).then((user) => {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        res.status(200).json({ result: true, token: user.token });
      } else {
        res.status(200).json({
          result: false,
          error: "Collaborateur inconnu ou password non valide",
        });
      }
    });
  } catch (err) {
    return next(err);
  }
}); // fin signin

// getAllUsers - TEST OK
router.get("/all", (req, res, next) => {
  try {
    // Lecture des users
    User.find()
      .select({ _id: 0, __v: 0, token: 0, password: 0 })
      .then((data) => {
        if (data.length !== 0) {
          res.status(200).json({ result: true, users: data });
        } else {
          // il n'y a pas de clients
          res.status(200).json({ result: false, error: "aucun collaborateur" });
        }
      });
  } catch (err) {
    return next(err);
  }
}); // fin getAllusers

// updateUser [idCollab] - TEST OK
router.put("/:idCollab", (req, res, next) => {
  try {
    // Verification des parametres
    if (!req.params.idCollab) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    console.log(
      "collab demande modification pour idCollab =>",
      req.params.idCollab
    );

    // MAJ du Collaborateur
    User.findOne({ username: req.params.idCollab }).then((data) => {
      if (data !== null) {
        // si Mission existe alors on va la mettre a jour
        User.updateOne(
          { username: req.params.idCollab },
          {
            ...req.body,
          }
        )
          .then((data) => {
            res
              .status(200)
              .json({ result: true, return: "Collaborateur modifié" });
          })
          .catch((error) => {
            console.log(`Update de ${req.params.idCollab} en erreur:${err}`);
            res.status(200).json({ result: false, return: error });
          });
      } else {
        // Collaborateur n'existe pas
        res
          .status(200)
          .json({ result: false, error: "Collaborateur non trouvé" });
      }
    });
  } catch (err) {
    return next(err);
  }
}); //fin updateUser

// deleteUser [idCollab] - TEST OK
router.delete("/:idCollab", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!req.params.idCollab) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    console.log(
      "collaborateur demande suppression pour username =>",
      req.params.idCollab
    );

    // Delete du Collab
    User.findOne({ username: req.params.idCollab }).then((data) => {
      if (data !== null) {
        // si User existe pas alors on va la supprimer
        User.deleteOne({ username: req.params.idCollab })
          .then((data) => {
            res
              .status(200)
              .json({ result: true, return: "collaborateur supprimé" });
          })
          .catch((error) => {
            console.log(`Delete de ${req.params.idCollab} en erreur:${err}`);
            res.status(200).json({ result: false, return: error });
          });
      } else {
        // User n'existe pas
        res
          .status(200)
          .json({ result: false, error: "collaborateur non trouvé" });
      }
    });
  } catch (err) {
    console.log(`Delete de ${req.params.idCollab} en erreur:${err}`);
    return next(err);
  }
}); ///fin DeleteCollab

module.exports = router;
