var MongoClient = require('mongodb').MongoClient;
var settings = require("../settings");
var markdown = require("markdown").markdown;

function Post(name, title, post){
	this.name = name;
	this.title = title;
	this.post = post;
}

module.exports = Post;

Post.prototype.save = function(callback){
	
	var date = new Date();
	var time = {
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear() + "-" + (date.getMonth() + 1),
		day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + ":" + 
				date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes()
	}
	var post = {
		name: this.name,
		time: time,
		title: this.title,
		post: this.post
	}
	MongoClient.connect(settings.dbhost, function(err, client) {
		if(err){
			return callback(err);
		}
		var db = client.db(settings.dbname);
		// Insert a single document
		db.collection('posts').insertOne(post, function(err, user) {
			if(err){
	    		client.close();
				return callback(err);
			}
			callback(null, user[0])
	    	client.close();
		});
	});
}

Post.get = function(name, callback){
	MongoClient.connect(settings.dbhost, function(err, client) {
		if(err){
			callback(err);
		}
		var db = client.db(settings.dbname);
		db.collection("posts", {strict: true}, function(err, collection){
			if(err){
				client.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			collection.find(query).sort({time: -1}).toArray(function(err, docs){
				client.close();
				if(err){
					return callback(err);
				}
				docs.forEach(function(doc){
					if(doc.post){
						doc.post = markdown.toHTML(doc.post);
					}
				})
				callback(null, docs);
			})
		})
	});
}