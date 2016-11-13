var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //logout and render index
  res.render('index', {});
});

module.exports = router;
