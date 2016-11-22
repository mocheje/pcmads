var express = require('express');
var router = express.Router();
var pcmQuery = require('../models/pcm');

/* GET validations. */
router.get('/pcm/gls', function(req, res, next) {
    pcmQuery.getGls(function(err, response){
        if(response){
            res.json({success: true, data: response});
        } else {
            res.json({error: true, message: err});
        }
    });

});
router.get('/pcm/senders', function(req, res, next) {
    pcmQuery.getWbs(function(err, response){
        if(response){
            res.json({success: true, data: response});
        } else {
            res.json({error: true, message: err});
        }
    });

});

router.get('/pcm/assignments', function(req, res, next) {
    pcmQuery.getAssignments(function(err, response){
        if(response){
            res.json({success: true, data: response});
        } else {
            res.json({error: true, message: err});
        }
    });

});

router.get('/pcm/drivers', function(req, res, next) {
    pcmQuery.getDrivers(function(err, response){
        if(response){
            res.json({success: true, data: response});
        } else {
            res.json({error: true, message: err});
        }
    });

});

router.get('/pcm/assets', function(req, res, next) {
    pcmQuery.getAssets(function(err, response){
        if(response){
            res.json({success: true, data: response});
        } else {
            res.json({error: true, message: err});
        }
    });

});

router.get('/pcm/uapcodes', function(req, res, next) {
    pcmQuery.getAssets(function(err, response){
        if(response){
            res.json({success: true, data: response});
        } else {
            res.json({error: true, message: err});
        }
    });

});

router.get('/pcm', function(req, res, next) {
    res.render('pcm');
});

module.exports = router;
