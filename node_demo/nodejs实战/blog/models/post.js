var MongoClient = require('mongodb').MongoClient;
var settings = require("../settings");
var markdown = require("markdown").markdown;
var Comment = require("../models/comment");

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
		post: this.post,
		comments: []
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

Post.getAll = function(name, page, callback){
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
			
			collection.count(query, function(err, total){
				collection.find(query, {
					skip:(page-1)*10,
					limit: 10
				}).sort({time: -1}).toArray(function(err, docs){
					client.close();
					if(err){
						return callback(err);
					}
					docs.forEach(function(doc){
						if(doc.post){
							doc.post = markdown.toHTML(doc.post);
						}
					})
					callback(null, docs, total);
				})
			})
			
		})
	});
}

//获取一篇文章
Post.getOne = function(name, day, title, callback){
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
			var query = {
				"name": name,
				"time.day": day,
				"title": title
			};
			collection.find(query).toArray(function(err, docs){
				client.close();
				if(err){
					return callback(err);
				}
				docs.forEach(function(doc){
					if(doc.post){
						doc.post = markdown.toHTML(doc.post);
					}
					if(doc.comments){
						doc.comments.forEach(function(comment){
							comment.content = markdown.toHTML(comment.content);
						})
					}
					
				})
				console.log("docs-------", docs)
				callback(null, docs[0]);
			})
			
		})
	});
}

Post.edit = function(name, day, title, callback){
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
			var query = {
				"name": name,
				"time.day": day,
				"title": title
			};
			collection.find(query).sort({time: -1}).toArray(function(err, docs){
				client.close();
				if(err){
					return callback(err);
				}
				callback(null, docs[0]);
			})
			
		})
	});
}

Post.update = function(name, day, title, post, callback){
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
			var query = {
				"name": name,
				"time.day": day,
				"title": title
			};
			collection.updateOne(query, {$set: {post: post}}, function(err, result){
				client.close();
				if(err){
					return callback(err);
				}
				callback(null);
			})
			
		})
	});
}


Post.remove = function(name, day, title, callback){
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
			var query = {
				"name": name,
				"time.day": day,
				"title": title
			};
			collection.deleteOne(query, function(err, result){
				client.close();
				if(err){
					return callback(err);
				}
				callback(null);
			})
			
		})
	});
}
