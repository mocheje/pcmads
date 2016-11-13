var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

});
router.post('/', passport.authenticate('local-signup', {
  successRedirect : '/', // redirect to the secure profile section
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

module.exports = router;
