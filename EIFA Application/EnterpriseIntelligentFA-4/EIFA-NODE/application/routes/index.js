var express = require("express");
var router = express.Router();

const home = require("../home/routes/index");
const analysis = require("../home/routes/analysis");

/* GET home page. */
router.use("/", home);

/* GET analysis. */
router.use("/analysis", analysis);

module.exports = router;