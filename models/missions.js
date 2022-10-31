const mongoose = require("mongoose");

const missionSchema = mongoose.Schema(
  {
    idMission: String, // idMission
    idClient: String, // id du Client
    idCollab: String, // id du Collaborateur Affecté à la mission
    entreprise: String, // nom de l'entreprise
    libelle: String, // Bilan Comptable
    type: String, // Bilan | TVA |PAIE....
    echeance: String, // data 2022-10-31
    accompli: String, // date 2022-10-31
    tempsPrevu: Number, // en heure
    tempsRealise: Number, // en heure
    progression: Number, // % de realisation de 0 à 100
    isDaily: Boolean, // si selection dans ma journée
  },
  {
    timestamps: true,
  }
);

const Mission = mongoose.model("missions", missionSchema);

module.exports = Mission;
