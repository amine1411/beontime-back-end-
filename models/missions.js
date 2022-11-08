const mongoose = require("mongoose");

const missionSchema = mongoose.Schema(
  {
    idMission: String,
    idClient: String,
    idCollab: String,
    entreprise: String,
    libelle: String,
    type: String,
    echeance: String,
    accompli: String,
    tempsPrevu: Number,
    tempsRealise: Number,
    progression: Number,
    isDaily: Boolean,
  },
  {
    timestamps: true,
  }
);

const Mission = mongoose.model("missions", missionSchema);

module.exports = Mission;
