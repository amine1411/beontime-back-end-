var express = require("express");
var router = express.Router();
const Mission = require("../models/missions");
const { checkBody } = require("../modules/checkBody");

// getAllMissions
// retourne toutes les missions
// param - aucun
router.get("/all", (req, res, next) => {
  //
  try {
    // Lecture des toutes missions
    Mission.find()
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data.length !== 0) {
          // il a des missions on retourne les missions
          res.status(200).json({ result: true, missions: data });
        } else {
          // il n'y a pas de mission on retourne aucune mission
          res.status(200).json({ result: false, error: "aucune mission" });
        }
      });
    //
  } catch (err) {
    return next(err);
  }
  //
}); // fin getAllClients

// getMission_by_idMission
// retourne une mission
// param [idMission]
router.get("/mission/:idMission", (req, res, next) => {
  ///
  try {
    // Verification des parametres
    if (!req.params.idMission) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // On cherche la mission dans la base
    Mission.findOne({ idMission: req.params.idMission })
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data !== null) {
          // Mission existe on retourne la mission
          res.status(200).json({ result: true, missions: data });
        } else {
          // Mission n'existe pas on retourne une erreur
          res
            .status(200)
            .json({ result: false, error: "La mission n'existe pas" });
        }
      });
  } catch (err) {
    return next(err);
  }
}); /// fin getMission_by_idMission]

// getMissions_by_idCollab params
// retourne toutes les missions d'un collaborateur
// param [idCollab]
router.get("/collab/:idCollab", (req, res, next) => {
  ///
  try {
    // Verification des parametres
    if (!req.params.idCollab) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    //console.log("missions/collab pour le idCollab =>", req.params.idCollab);

    // On cherche les missions du Collaborateur
    Mission.find({ idCollab: req.params.idCollab })
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data.length !== 0) {
          // Une ou des mission on retourne la liste des missions
          res.status(200).json({ result: true, missions: data });
        } else {
          // Aucune Mission pour ce collaborateur
          res
            .status(200)
            .json({ result: false, error: "No Mission for this Collab" });
        }
      });
    //
  } catch (err) {
    return next(err);
  }
}); /// fin getMission by idCollab

// getMission_by_idClient
// retourne toutes les missions d'un client
// params [idClient]
router.get("/client/:idClient", (req, res, next) => {
  //

  try {
    // Verification des parametres
    if (!req.params.idClient) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    //console.log("missions/client pour le idClient =>", req.params.idClient);

    // On cherche les missions du Client
    Mission.find({ idClient: req.params.idClient })
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data.length !== 0) {
          // Une ou des missions on retourne la liste des missions
          res.status(200).json({ result: true, missions: data });
        } else {
          // Aucune mission on retourne pas de mission pour ce client
          res
            .status(200)
            .json({ result: false, error: "Aucune mission pour ce Client" });
        }
      });
    //
  } catch (err) {
    return next(err);
  }
}); /// fin getMission by idClient

// addMission
// ajouter une mission
// params [idMission, idClient, idCollab]
router.post("/", (req, res, next) => {
  //
  try {
    // Verification des parametres (only Keys)
    if (!checkBody(req.body, ["idMission", "idClient", "idCollab"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    //console.log("Demande Creation d'une Mission =>", req.body);

    // Creation de la Mission
    // on verifie si la mission existe deja
    Mission.findOne({ idMission: req.body.idMission }).then((data) => {
      if (data === null) {
        // si Mission n'existe pas alors on va le créer
        const newMission = new Mission({
          idMission: req.body.idMission,
          idClient: req.body.idClient,
          idCollab: req.body.idCollab,
          entreprise: req.body.entreprise,
          libelle: req.body.libelle,
          type: req.body.type,
          echeance: req.body.echeance,
          accompli: "",
          tempsPrevu: req.body.tempsPrevu,
          tempsRealise: 0,
          progression: 0,
          isDaily: false,
        });

        // on sauvegarde dans la base
        newMission.save().then((newMission) => {
          // on retourne la mission créée
          res.status(200).json({ result: true, mission: newMission });
        });
      } else {
        // La mission existe deja - on retourne la mission existe
        res.status(200).json({ result: false, error: "Mission existe deja" });
      }
    });
    //
  } catch (err) {
    return next(err);
  }
}); //////fin AddMission

// updateMission
// Mise à jour d'une Mission
// param [idMission]
router.put("/:idMission", (req, res, next) => {
  //
  try {
    // Verification des parametres
    if (!req.params.idMission) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    //console.log("Mission demande modification pour idMission =>",req.params.idMission);

    // MAJ de la Mission
    Mission.findOne({ idMission: req.params.idMission }).then((data) => {
      if (data !== null) {
        // Si Mission existe alors on va la mettre a jour
        Mission.updateOne(
          { idMission: req.params.idMission },
          {
            ...req.body,
          }
        )
          .then((data) => {
            res.status(200).json({ result: true, return: "Mission modifiée" });
          })
          .catch((error) => {
            console.log(`Update de ${req.params.idMission} en erreur:${err}`);
            res.status(200).json({ result: false, return: error });
          });
      } else {
        // Mission n'existe pas
        res.status(200).json({ result: false, error: "Mission non trouvé" });
      }
    });
    //
  } catch (err) {
    return next(err);
  }
}); //fin UpdateMissionProgression

// deleteMission
// Suppression d'une Mission
// param [idMission]
router.delete("/:idMission", (req, res, next) => {
  //
  try {
    // Verification des parametres
    if (!req.params.idMission) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    //console.log("mission demande suppression pour idMission =>",req.params.idMission);

    // Suppression de la Mission
    Mission.findOne({ idMission: req.params.idMission }).then((data) => {
      if (data !== null) {
        // Si Mission existe pas alors on va la supprimer
        Mission.deleteOne({ idMission: req.params.idMission })
          .then((data) => {
            res.status(200).json({ result: true, return: "mission supprimée" });
          })
          .catch((error) => {
            console.log(`Delete de ${req.params.idMission} en erreur:${err}`);
            res.status(200).json({ result: false, return: error });
          });
      } else {
        // Mission n'existe pas
        res.status(200).json({ result: false, error: "Mission non trouvée" });
      }
    });
    //
  } catch (err) {
    console.log(`Delete de ${req.params.idMission} en erreur:${err}`);
    return next(err);
  }
}); ///fin DeleteMission

module.exports = router;
