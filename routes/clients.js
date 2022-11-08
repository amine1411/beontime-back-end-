//---------------------------------------------------
// ROUTEUR CLIENTS
//---------------------------------------------------
var express = require("express");
var router = express.Router();

// Import du Modèle Mongoose des Clients
const Client = require("../models/clients");

// Utilisation du module checkbody pour vérifier la présence des paramètres dans req.body
const { checkBody } = require("../modules/checkBody");

// getAllClients
// retourne tous les clients
// param : aucun
router.get("/all", (req, res, next) => {
  try {
    // Lecture des clients
    Client.find()
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data.length !== 0) {
          // il y a un ou des Clients on retourne les data
          res.status(200).json({ result: true, clients: data });
        } else {
          // il n'y a pas de Client
          res
            .status(200)
            .json({ result: false, error: "Aucun Client dans la base" });
        }
      });
  } catch (err) {
    return next(err);
  }
}); // fin getAllClients

// getClient_by_idClient
// retourne un client
// param [idClient]
router.get("/:idClient", (req, res, next) => {
  try {
    // Verification des parametres
    if (!req.params.idClient) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // On cherche le Client dans la base
    Client.findOne({ idClient: req.params.idClient })
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data !== null) {
          // Client existe on retourne les data
          res.status(200).json({ result: true, clients: data });
        } else {
          // Client n'existe pas on retourne une erreur
          res
            .status(200)
            .json({ result: false, error: "Le Client n'existe pas" });
        }
      });
  } catch (err) {
    return next(err);
  }
}); /// fin getClient_by_idClient

// addClient
// ajouter un client
// params [idClient, entreprise]
router.post("/", (req, res, next) => {
  //
  try {
    // Verification des parametres
    if (!checkBody(req.body, ["idClient", "entreprise"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // console.log("Demande Creation d'un Client =>", req.body);

    // Creation du Client
    // on verifie si le client existe deja
    Client.findOne({ idClient: req.body.idClient }).then((data) => {
      if (data === null) {
        // si Client n'existe pas alors on va le créer
        const newClient = new Client({
          idClient: req.body.idClient,
          entreprise: req.body.entreprise,
          isActive: true,
        });

        // on enregistre le Client dans la base
        newClient.save().then((newClient) => {
          // on retourne le client créé
          res.status(200).json({ result: true, client: newClient });
        });
      } else {
        // Client existe deja - on retourne le client existe
        res.status(200).json({ result: false, error: "Client existe deja" });
      }
    });
    //
  } catch (err) {
    return next(err);
  }
}); //////fin AddClient

// updateClient
// mettre à jour un Client
// param [idClient]
router.put("/:idClient", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!req.params.idClient) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // console.log("Client demande modification pour idClient =>",req.params.idClient);

    // MAJ du Client
    Client.findOne({ idClient: req.params.idClient }).then((data) => {
      if (data !== null) {
        // si Client existe pas alors on va le mettre a jour
        Client.updateOne(
          { idClient: req.params.idClient },
          {
            ...req.body,
          }
        )
          .then((data) => {
            res.status(200).json({ result: true, return: "Client modifié" });
          })
          .catch((error) => {
            console.log(`Update de ${req.params.idClient} en erreur:${err}`);
            res.status(200).json({ result: false, return: error });
          });
      } else {
        // Client n'existe pas
        res.status(200).json({ result: false, error: "Client non trouvé" });
      }
    });
    //////////////
  } catch (err) {
    return next(err);
  }
}); //fin UpdateClient

// deleteClient
// suppression d'un Client
// params [idClient]
router.delete("/:idClient", (req, res, next) => {
  //
  try {
    // Verification des parametres
    if (!req.params.idClient) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // console.log("client demande suppression pour idClient =>",req.params.idClient);

    // Suppression du Client
    Client.findOne({ idClient: req.params.idClient }).then((data) => {
      if (data !== null) {
        // si Client existe pas alors on va le supprimer
        Client.deleteOne({ idClient: req.params.idClient })
          .then((data) => {
            res.status(200).json({ result: true, return: "client supprimé" });
          })
          .catch((error) => {
            console.log(`Delete de ${req.params.idClient} en erreur:${err}`);
            res.status(200).json({ result: false, return: error });
          });
      } else {
        // Client n'existe pas
        res.status(200).json({ result: false, error: "Client non trouvé" });
      }
    });
    //////////////
  } catch (err) {
    console.log(`Delete de ${req.params.idClient} en erreur:${err}`);
    return next(err);
  }
}); ///fin DeleteClient

module.exports = router;
