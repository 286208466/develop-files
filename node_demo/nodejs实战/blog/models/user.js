var MongoClient = require('mongodb').MongoClient;
var settings = require("../settings");

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback){
	var user = {
		name: this.name,
		password: this.password,
		email: this.email
	}
	MongoClient.connect(settings.dbhost, function(err, client) {
		if(err){
			return callback(err);
		}
		var db = client.db(settings.dbname);
		// Insert a single document
		db.collection('users').insertOne(user, function(err, user) {
			if(err){
	    		client.close();
				return callback(err);
			}
			callback(null, user[0])
	    	client.close();
		});
	});
}

User.get = function(name, callback){
	MongoClient.connect(settings.dbhost, function(err, client) {
		if(err){
			callback(err);
		}
		var db = client.db(settings.dbname);
		db.collection("users", {strict: true}, function(err, collection){
			if(err){
				client.close();
				return callback(err);
			}
			collection.findOne({
				name: name
			}, function(err, user){
				client.close();
				if(err){
					return callback(err);
				}
				callback(null, user);
			})
		})
	});
}