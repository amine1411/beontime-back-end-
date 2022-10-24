const mongoose = require("mongoose");

const missionSchema = mongoose.Schema(
  {
    idMission: String,
    idClient: String,
    idCollab: String,
    entreprise: String,
    libelle: String, // Bilan Comptable
    type: String, // Bilan
    echeance: String,
    accompli: String,
    tempsPrevu: Number,
    tempsRealise: Number,
    progression: Number, // % de realisation de 0 à 100
  },
  {
    timestamps: true,
  }
);

const Mission = mongoose.model("missions", missionSchema);

module.exports = Mission;
