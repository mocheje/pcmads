var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('add_gl', {
    user : req.user // get the user out of session and pass to template you can add other parameters
  });
});


module.exports = router;
