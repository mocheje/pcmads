var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    setTimeout(function(){
        console.log(req);
        res.statusCode = 200;
        res.end('ok');
    }, 6000);

});

module.exports = router;
