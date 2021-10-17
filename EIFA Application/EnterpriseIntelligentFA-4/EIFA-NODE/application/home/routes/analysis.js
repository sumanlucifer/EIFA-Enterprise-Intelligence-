const express = require("express");
const router = express.Router();

const {
	addanalysisController,
	getalluseranalysisController,
	removeanalysisController,
	getuseranalysisController

} = require("../controller/analysis");

/***** Analysis ******/
router.post('/addanalysis', addanalysisController);
router.get('/getalluseranalysis', getalluseranalysisController);
router.post('/removeanalysis', removeanalysisController);
router.post('/getuseranalysis', getuseranalysisController);

module.exports = router;