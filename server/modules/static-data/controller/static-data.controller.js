const { staticDataService } = require("../services/static-data.services");

const staticDataController = (_req, res) => {
  const { steps } = staticDataService();
  try {
    res.status(200).json({ steps });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { staticDataController };
