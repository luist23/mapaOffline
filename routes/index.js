var express = require('express');
var router = express.Router();
const tiles = require('../controller/mapOffline')

/* GET home page. */
router.get('/', function(req, res, next) {
  tiles.doWork()
  res.render('index', { title: 'Express' });
});

module.exports = router;
