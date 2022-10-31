var express = require("express");
var router = express.Router();
const Mission = require("../models/missions");
const { checkBody } = require("../modules/checkBody");

// getAllMissions - TEST OK
// retourne les toutes les missions
router.get("/all", (req, res, next) => {
  //
  try {
    // Lecture des toutes missions
    Mission.find()
      .select({ _id: 0, __v: 0 })
      .then((data) => {
        if (data.length !== 0) {
          // il a des missions renvoyer les data
          res.status(200).json({ result: true, missions: data });
        } else {
          // il n'y a pas de missions revoyer aucune mission
          res.status(200).json({ result: false, error: "aucune mission" });
        }
      });
    //
  } catch (err) {
    return next(err);
  }
  //
});

// getMission_by_idMission] - TEST OK
// retourne une mission
router.get("/mission/:idMission", (req, res, next) => {
  //////////////
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
          // Mission existe on retourne les data
          res.status(200).json({ result: true, missions: data });
        } else {
          // Mission n'existe pas on retourne une erreur
          res
            .status(200)
            .json({ result: false, error: "La mission n'existe pas" });
        }
      });
    //////////////
  } catch (err) {
    return next(err);
  }
}); /// fin _by_idMission]

// getMissions_by_idCollab params [idCollab] - TEST OK
// retourne toutes les missions d'un collaborateur
router.get("/collab/:idCollab", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!req.params.idCollab) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    console.log("missions/collab pour le idCollab =>", req.params.idCollab);

    // On cherche la mission
    Mission.find({ idCollab: req.params.idCollab })
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

// getMission_by_idClient params [idClient] - TEST OK
// retourne toutes les missions d'un client
router.get("/client/:idClient", (req, res, next) => {
  //////////////
  console.log(req.body);
  try {
    // Verification des parametres
    if (!req.params.idClient) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    console.log("missions/client pour le idClient =>", req.params.idClient);

    // On cherche les missions du idClient
    Mission.find({ idClient: req.params.idClient })
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
// ajouter une mission
// params KEYS [idMission, idClient, idCollab]
router.post("/", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres (only Keys)
    if (!checkBody(req.body, ["idMission", "idClient", "idCollab"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }
    console.log("Demande Creation d'une Mission =>", req.body);
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
          accompli: req.body.accompli,
          tempsPrevu: parseInt(req.body.tempsPrevu),
          tempsRealise: 0,
          progression: 0,
          isDaily: false,
        });

        newMission.save().then((newMission) => {
          res.status(200).json({ result: true, mission: newMission });
        });
      } else {
        // La mission existe deja - on retourne la mission existe
        res.status(200).json({ result: false, error: "Mission existe deja" });
      }
    });
    //////////////
  } catch (err) {
    return next(err);
  }
}); //////fin AddMission

// updateMission params [tous]
router.put("/:idMission", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!req.params.idMission) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    if (
      !checkBody(req.body, [
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

    // MAJ de la Mission
    Mission.findOne({ idMission: req.params.idMission }).then((data) => {
      if (data !== null) {
        // si Mission existe alors on va la mettre a jour
        Mission.updateOne(
          { idMission: req.params.idMission },
          {
            idClient: req.body.idClient,
            idCollab: req.body.idCollab,
            entreprise: req.body.entreprise,
            libelle: req.body.libelle,
            type: req.body.type,
            echeance: req.body.echeance,
            tempsPrevu: parseInt(req.body.tempsPrevu),
          }
        )
          .then((data) => {
            res.status(200).json({ result: true, return: "Mission modified" });
          })
          .catch((error) => {
            console.log(`Update de ${req.params.idMission} en erreur:${err}`);
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

// updateMissionProgression params [idMission, tempsRealise, progression]
router.put("/progression/idMission", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!req.params.idMission) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }
    if (!checkBody(req.body, ["tempsRealise", "progression", "accompli"])) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // MAJ de la Mission
    Mission.findOne({ idMission: req.body.idMission }).then((data) => {
      if (data !== null) {
        // si Mission existe alors on va la mettre a jour
        Mission.updateOne(
          { idMission: req.params.idMission },
          {
            tempsRealise: parseInt(req.body.tempsRealise),
            progression: parseInt(req.body.progression),
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
router.delete("/:idMission", (req, res, next) => {
  //////////////
  try {
    // Verification des parametres
    if (!req.params.idMission) {
      res.status(200).json({ result: false, error: "Missing fields" });
      return;
    }

    // Delete de la Mission
    Mission.findOne({ idMission: req.params.idMission }).then((data) => {
      if (data !== null) {
        // si Mission existe pas alors on va la supprimer
        Mission.deleteOne({ idMission: req.params.idMission })
          .then((data) => {
            res.status(200).json({ result: true, return: "mission deleted" });
          })
          .catch((error) => {
            console.log(`Delete de ${req.params.idMission} en erreur:${err}`);
            res.status(200).json({ result: false, return: error });
          });
      } else {
        // Mission n'existe pas
        res.status(200).json({ result: false, error: "Mission not found" });
      }
    });
    //////////////
  } catch (err) {
    console.log(`Delete de ${req.params.idMission} en erreur:${err}`);
    return next(err);
  }
}); ///fin DeleteMission

module.exports = router;
