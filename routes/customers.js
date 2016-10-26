/**
 * Created by bdalgaard on 10/19/2016.
 */
var util = require('util');

var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('test', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'test' database");
        db.collection('customers', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'customers' collection doesn't exist.");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving customer: ' + id);
    db.collection('customers', function(err, collection) {
        collection.findOne({'_id': new ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    console.log('Retrieving all customers');
    db.collection('customers', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};


