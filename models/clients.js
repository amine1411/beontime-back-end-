const mongoose = require("mongoose");

const clientSchema = mongoose.Schema(
  {
    idClient: String,
    entreprise: String,
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("clients", clientSchema);

module.exports = Client;
