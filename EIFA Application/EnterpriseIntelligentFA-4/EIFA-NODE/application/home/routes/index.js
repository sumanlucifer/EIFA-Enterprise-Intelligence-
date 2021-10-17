const express = require("express");
const router = express.Router();

const {
	homeController,
	searchController,
	addfavouriteController,
	getfavouriteController,
	removefavouriteController,
	gettileviewController,
	getUserController,
	getInsightsController,
	getRecommendationController

} = require("../controller/index");

router.get('/', homeController);
router.get('/getuserdetails', getUserController);
router.post('/search', searchController);
router.post('/addfavourite', addfavouriteController);
router.post('/removefavourite', removefavouriteController);
router.get('/getuserfavourite', getfavouriteController);
router.get('/getuserinsights', getInsightsController);
router.get('/tileview', gettileviewController);
router.get('/getRecommendation', getRecommendationController);

module.exports = router;