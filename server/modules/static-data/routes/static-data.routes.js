const appRouter = require("express").Router();
const { staticDataController } = require("../controller/static-data.controller");

appRouter.get("/api/products", staticDataController);
module.exports = appRouter;