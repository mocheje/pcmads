var express = require('express');
var router = express.Router();
var pcmQuery = require('../models/pcm');

/* GET validations. */
router.get('/', function(req, res, next) {
    pcmQuery.getAssignments(function(err, response){
        if(response){
            res.render('assignments',
                {
                    assignment: response,
                    helpers: {
                        next: function (index) {
                            return index + 1
                        }
                    }
                });
        } else {
            res.end(err);
        }
    });

});



module.exports = router;
