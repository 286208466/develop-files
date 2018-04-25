var settings = require("../settings");

var mongo = require('mongoskin');
var Db = mongo.Db;
var Server = mongo.Server;
var MongoClient = mongo.MongoClient;

var db = mongo.db((settings.dbhost + settings.dbname), {native_parser:true});
module.exports = db;

//module.exports = new Db(settings.db, new Server(settings.host, 27017), {safe: true});

/*var MongoClient = require('mongodb').MongoClient;
var url = settings.dbhost + settings.dbname;
module.exports = MongoClient;*/