var express = require("express");
var router = express.Router();
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// signup
// Creation d'un Collaborateur
// params [username, password, nom, prenom, picture, isManager, isCollab, isWorking]
router.post("/signup", (req, res, next) => {
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

    //console.log("signup/collab pour le req.body =>", req.body);

    // Creation du Collaborateur
    User.findOne({ username: req.body.username }).then((data) => {
      if (data === null) {
        // si le Collaborateur n'existe pas alors on va le créer

        // sécurisation du password par hash via bcrypt,
        // création d'un token via uid2()

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

        // sauvegarde dans la base
        newUser.save().then((newUser) => {
          // on retourne le token au Collaborateur
          res.status(200).json({ result: true, token: newUser.token });
        });
      } else {
        // Le Collaborateur existe deja on retourne existe deja
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
// params [username, password]
router.post("/signin", (req, res, next) => {
  try {
    // Vérification des parametres
    if (!checkBody(req.body, ["username", "password"])) {
      res.status(200).json({ result: false, error: "Missing or empty fields" });
      return;
    }

    // Vérification de l'existence du Collaborateur

    User.findOne({
      username: req.body.username,
    }).then((user) => {
      // Si le collaborateur existe
      // On compare le hash du password fourni et celui en base
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        // on retourne les informations concernant le collaborateur
        res.status(200).json({
          result: true,
          token: user.token,
          picture: user.picture,
          username: user.username,
          prenom: user.prenom,
          isManager: user.isManager,
        });
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

// getAllUsers
// liste de tous les Collaborateurs
// param - aucun
router.get("/all", (req, res, next) => {
  try {
    // Lecture des collaborateurs
    // Exclusion du token et du password de la sélection des champs de la requete
    User.find()
      .select({ _id: 0, __v: 0, token: 0, password: 0 })
      .then((data) => {
        if (data.length !== 0) {
          // il y a un ou des collaborateurs on retourne les informations non sensibles des collaborateurs
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

// updateUser
// Mettre à jour un Collaborateur
// param [idCollab]
router.put("/:idCollab", (req, res, next) => {
  try {
    // Verification des parametres
    if (!req.params.idCollab) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    //console.log("collab demande modification pour idCollab =>",req.params.idCollab);

    // MAJ du Collaborateur
    User.findOne({ username: req.params.idCollab }).then((data) => {
      if (data !== null) {
        // si Collaborateur existe alors on va la mettre a jour
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

// deleteUser
// Suppression d'un Collaborateur
// param [idCollab]
router.delete("/:idCollab", (req, res, next) => {
  //
  try {
    // Verification des parametres
    if (!req.params.idCollab) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    //console.log("collaborateur demande suppression pour username =>",req.params.idCollab);

    // Suppression du Collaborateur
    User.findOne({ username: req.params.idCollab }).then((data) => {
      if (data !== null) {
        // si Collaborateur existe pas alors on va la supprimer
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
        // Collaborateur n'existe pas
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
