const router = require("express").Router();
const dbRoutes = require("./dbRoutes");


router.use("/api", dbRoutes);


module.exports = router;
