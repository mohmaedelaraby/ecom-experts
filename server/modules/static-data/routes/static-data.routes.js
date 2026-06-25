const appRouter = require("express").Router();
const { staticDataController } = require("../controller/static-data.controller");

appRouter.get("/static-data", staticDataController);
module.exports = appRouter;