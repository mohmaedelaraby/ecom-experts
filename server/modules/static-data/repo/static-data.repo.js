const { steps } = require("../../../data/products.json");

const staticDataRepo = () => {
  return {
    steps,
  };
};

module.exports = { staticDataRepo };
