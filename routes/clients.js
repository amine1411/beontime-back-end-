var express = require("express");
var router = express.Router();
const Client = require("../models/clients");
const { checkBody } = require("../modules/checkBody");

// getAllClients
router.get("/all", (req, res, next) => {
  //////////////
  try {
    // Lecture des clients
    Client.find()
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data.length !== 0) {
          res.status(200).json({ result: true, clients: data });
        } else {
          // il n'y a pas de clients
          res.status(200).json({ result: false, error: "No Clients in DB" });
        }
      });
  } catch (err) {
    return next(err);
  }
  //////////////
});

// getClient params [idClient]
router.get("/", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!checkBody(req.body, ["idClient"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // On cherche le Client
    Client.findOne({ idClient: req.body.idClient })
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data !== null) {
          res.status(200).json({ result: true, clients: data });
        } else {
          // User already exists in database
          res
            .status(200)
            .json({ result: false, error: "Client does not exist" });
        }
      });
    //////////////
  } catch (err) {
    return next(err);
  }
}); /// fin Get Client

// addClient params [idClient, entreprise]
router.post("/", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!checkBody(req.body, ["idClient", "entreprise"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // Creation du Client
    Client.findOne({ idClient: req.body.idClient }).then((data) => {
      if (data === null) {
        // si Client n'existe pas alors on va le créer
        const newClient = new Client({
          idClient: req.body.idClient,
          entreprise: req.body.entreprise,
          isActive: true,
          isGenerated: false,
        });

        newClient.save().then((newClient) => {
          res.status(200).json({ result: true, client: newClient });
        });
      } else {
        // Client already exists in database
        res.status(200).json({ result: false, error: "Client already exists" });
      }
    });
    //////////////
  } catch (err) {
    return next(err);
  }
}); //////fin AddClient

// updateClient params [idClient, entreprise, isActive]
router.put("/", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!checkBody(req.body, ["idClient", "entreprise", "isActive"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // MAJ du Client
    Client.findOne({ idClient: req.body.idClient }).then((data) => {
      if (data !== null) {
        // si Client existe pas alors on va le supprimer
        Client.updateOne(
          { idClient: req.body.idClient },
          {
            entreprise: req.body.entreprise,
            isActive: req.body.isActive,
          }
        )
          .then((data) => {
            res.status(200).json({ result: true, return: "modified" });
          })
          .catch((error) => {
            console.log(`Update de ${req.body.idClient} en erreur:${err}`);
            res.status(200).json({ result: false, return: error });
          });
      } else {
        // Client n'existe pas
        res.status(200).json({ result: false, error: "Client not found" });
      }
    });
    //////////////
  } catch (err) {
    return next(err);
  }
}); //fin UpdateClient

// deleteClient params [idClient]
router.delete("/", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!checkBody(req.body, ["idClient"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // Delete du Client
    Client.findOne({ idClient: req.body.idClient }).then((data) => {
      if (data !== null) {
        // si Client existe pas alors on va le supprimer
        Client.deleteOne({ idClient: req.body.idClient })
          .then((data) => {
            res.status(200).json({ result: true, return: "deleted" });
          })
          .catch((error) => {
            console.log(`Delete de ${req.body.idClient} en erreur:${err}`);
            res.status(200).json({ result: false, return: error });
          });
      } else {
        // Client n'existe pas
        res.status(200).json({ result: false, error: "Client not found" });
      }
    });
    //////////////
  } catch (err) {
    console.log(`Delete de ${req.body.idClient} en erreur:${err}`);
    return next(err);
  }
}); ///fin DeleteClient

module.exports = router;
