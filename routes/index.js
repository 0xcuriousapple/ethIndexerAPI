const router = require("express").Router();
const dbRoutes = require("./dbRoutes");

const path = require("path");
router.use("/api", dbRoutes);


module.exports = router;
