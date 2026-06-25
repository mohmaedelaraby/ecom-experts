const { staticDataRepo } = require("../repo/static-data.repo");

const staticDataService = () => {
  const { steps, review } = staticDataRepo();
  if (!steps || !review) {
    throw new Error("Static data not found");
  }

  return { steps, review };
};

module.exports = { staticDataService };
