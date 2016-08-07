var express = require('express');
var router = express.Router();


router.use(function timeLog(req, res, next){
  console.log('Time: ', Date.now());
  next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', {title: "hi guru"});
  // res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  res.send('posted to /users!');
});

module.exports = router;
