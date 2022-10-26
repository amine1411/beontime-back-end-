var express = require("express");
var router = express.Router();
const Mission = require("../models/missions");
const { checkBody } = require("../modules/checkBody");

// getAllMissions
router.get("/all", (req, res, next) => {
  //
  try {
    // Lecture des missions
    Mission.find()
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data.length !== 0) {
          res.status(200).json({ result: true, missions: data });
        } else {
          // il n'y a pas de missions
          res.status(200).json({ result: false, error: "No Mission" });
        }
      });
    //
  } catch (err) {
    return next(err);
  }
  //
});

// getMission params [idMission]
router.get("/", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!checkBody(req.body, ["idMission"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // On cherche la mission
    Mission.findOne({ idMission: req.body.idMission })
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data !== null) {
          res.status(200).json({ result: true, missions: data });
        } else {
          // Mission n'existe pas
          res
            .status(200)
            .json({ result: false, error: "Mission does not exist" });
        }
      });
    //////////////
  } catch (err) {
    return next(err);
  }
}); /// fin getMission

// getMissions by idCollab params [idCollab]
router.get("/collab", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!checkBody(req.body, ["idCollab"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // On cherche la mission
    Mission.find({ idCollab: req.body.idCollab })
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data.length !== 0) {
          res.status(200).json({ result: true, missions: data });
        } else {
          // Aucune Mission pour ce idCollab
          res
            .status(200)
            .json({ result: false, error: "No Mission for this Collab" });
        }
      });
    //////////////
  } catch (err) {
    return next(err);
  }
}); /// fin getMission by idCollab

// getMission by idClient params [idClient]
router.get("/client", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!checkBody(req.body, ["idClient"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // On cherche les missions du idClient
    Mission.find({ idClient: req.body.idClient })
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data.length !== 0) {
          res.status(200).json({ result: true, missions: data });
        } else {
          // Mission n'existe pas
          res
            .status(200)
            .json({ result: false, error: "No Mission for this Client" });
        }
      });
    //////////////
  } catch (err) {
    return next(err);
  }
}); /// fin getMission by idClient

// addMission
// params [idMission, idClient, idCollab, entreprise, libelle, type, echeance, tempsPrevu]
router.post("/", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (
      !checkBody(req.body, [
        "idMission",
        "idClient",
        "idCollab",
        "entreprise",
        "libelle",
        "type",
        "echeance",
        "tempsPrevu",
      ])
    ) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }
    console.log("Demande Creation d'une Mission =>", req.body);
    // Creation de la Mission
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
          tempsPrevu: parseInt(req.body.tempsPrevu),
          tempsRealise: 0,
          Progression: 0,
        });

        newMission.save().then((newMission) => {
          res.status(200).json({ result: true, mission: newMission });
        });
      } else {
        // Mission already exists in database
        res
          .status(200)
          .json({ result: false, error: "Mission already exists" });
      }
    });
    //////////////
  } catch (err) {
    return next(err);
  }
}); //////fin AddMission

// updateMissionProgression params [idMission, tempsRealise, progression]
router.put("/progression", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (
      !checkBody(req.body, [
        "idMission",
        "tempsRealise",
        "progression",
        "accompli",
      ])
    ) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // MAJ de la Mission
    Mission.findOne({ idMission: req.body.idMission }).then((data) => {
      if (data !== null) {
        // si Mission existe alors on va la mettre a jour
        Mission.updateOne(
          { idMission: req.body.idMission },
          {
            tempsRealise: req.body.tempsRealise,
            progression: req.body.progression,
            accompli: req.body.accompli,
          }
        )
          .then((data) => {
            res.status(200).json({ result: true, return: "Mission modified" });
          })
          .catch((error) => {
            console.log(`Update de ${req.body.idMission} en erreur:${err}`);
            res.status(200).json({ result: false, return: error });
          });
      } else {
        // Mission n'existe pas
        res.status(200).json({ result: false, error: "Mission not found" });
      }
    });
    //////////////
  } catch (err) {
    return next(err);
  }
}); //fin UpdateMissionProgression

// deleteMission params [idMission]
router.delete("/", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!checkBody(req.body, ["idMission"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // Delete de la Mission
    Mission.findOne({ idMission: req.body.idMission }).then((data) => {
      if (data !== null) {
        // si Mission existe pas alors on va la supprimer
        Mission.deleteOne({ idMission: req.body.idMission })
          .then((data) => {
            res.status(200).json({ result: true, return: "mission deleted" });
          })
          .catch((error) => {
            console.log(`Delete de ${req.body.idMission} en erreur:${err}`);
            res.status(200).json({ result: false, return: error });
          });
      } else {
        // Mission n'existe pas
        res.status(200).json({ result: false, error: "Mission not found" });
      }
    });
    //////////////
  } catch (err) {
    console.log(`Delete de ${req.body.idClient} en erreur:${err}`);
    return next(err);
  }
}); ///fin DeleteMission

module.exports = router;
