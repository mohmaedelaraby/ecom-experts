const { steps, review } = require("../../../data/products.json");

const staticDataRepo = () => {
  return {
    steps,
    review,
  };
};

module.exports = { staticDataRepo };
