var express = require('express');
var router = express.Router();
var heatmapModel = require('../models/heatmap');
router.get('/', function(req, res, next) {
    console.log(req.query.startdate);
    var startDate = new Date(req.query.startdate);
    var endDate = new Date(req.query.enddate);

    heatmapModel.getHeatMap(startDate, endDate, function (err, heatMapData) {
        res.setHeader('Content-Type', 'application/json');
        if(err) {
            res.send({error: 'error'});
        } else {
            res.send(JSON.stringify(heatMapData));
        }


    });

});

module.exports = router;