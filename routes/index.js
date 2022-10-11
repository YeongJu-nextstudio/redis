var express = require('express');
var router = express.Router();
var redis = require('redis');
var redis_client = redis.createClient(6379,"test-redis.7eqnvn.ng.0001.apn2.cache.amazonaws.com");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // Redis
  redis_client.on("error", (err) => {
    console.error(err);
  });

  redis_client.on("ready", ()=> {
    console.log("Redis is Ready");
  });

  console.log("test");
});

module.exports = router;
