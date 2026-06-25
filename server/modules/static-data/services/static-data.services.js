const { staticDataRepo } = require("../repo/static-data.repo");

const staticDataService = () => {
  const { steps } = staticDataRepo();
  if (!steps ) {
    throw new Error("Static data not found");
  }

  return { steps };
};

module.exports = { staticDataService };
