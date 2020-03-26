/* 
 * Routes file for the API(s)
 */

let express = require('express');
let router = express.Router();


// Require the API file
let integrationAPI = require('../integrationAPI');


// API to post an alert to Big Panda based on the weather conditions 
router.post('/v1/integrations/bigPandaAlerts', integrationApi.postBigPandaAlert(req, res, next));


module.exports = router;