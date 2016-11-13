var util = require('util');


var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('test', server);

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

db.open(function(err, db) {
  if(!err) {
    console.log("successfully connected");
    db.collection('restaurants', {strict:true}, function(err, collection) {
      if (err) {
        console.log("not successfully connected");
      }
    });
  }
});


exports.findAll = function(req, res) {
  console.log('grabbing restaurants');
  db.collection('restaurants', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);

    });
  });
};

exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('grabbing restaurant: ' + id);
  db.collection('restaurants', function(err, collection) {
    collection.findOne({'_id': new ObjectID(id)}, function(err, item) {
      res.send(item);
    });
  });
};

exports.findAll = function(req, res) {
  console.log('grabbing every restaurant');
  db.collection('restaurants', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};

exports.addRestaurant = function(req, res) {
  var restaurant = req.body;
  console.log('Adding a Restaurant');
  db.collection('restaurants', function(err, collection) {
    collection.insert(restaurant, function(err, item) {
        res.send(item);
      });
  });
}

exports.updateRestaurant = function(req, res) {
  var id = req.params.id;
  var restaurant = req.body;
  console.log('Restaurant updating');
  db.collection('restaurants', function(err, collection) {
    collection.update({'_id': new ObjectID(id)}, restaurant,  function(err, result) {
        res.send(restaurant);
      });
  });
}


exports.deleteRestaurant = function(req, res) {
  db.collection('restaurants').deleteOne({_id: new ObjectID(req.params.id)},function(err, result){
    if(err) {
      handleError(res, err.message, "edit didn't take!!!");
    }
    else{
      res.status(204).end();
    }
  })
}


