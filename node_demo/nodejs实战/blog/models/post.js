var MongoClient = require('mongodb').MongoClient;
var settings = require("../settings");
var markdown = require("markdown").markdown;
var Comment = require("../models/comment");

function Post(name, title, tags, post){
	this.name = name;
	this.title = title;
	this.tags = tags;
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
		tags: this.tags,
		post: this.post,
		comments: [],
		reprint_info: {},
		pv: 0
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
			collection.findOne(query, function(err, doc){
				if(err){
					client.close();
					return callback(err);
				}
				collection.update(query, {$inc: {"pv": 1}}, function(err){
					client.close();
					if(err){
						return callback(err);
					}
				})
				if(doc.post){
					doc.post = markdown.toHTML(doc.post);
				}
				if(doc.comments){
					doc.comments.forEach(function(comment){
						comment.content = markdown.toHTML(comment.content);
					})
				}
				callback(null, doc);
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
			//查询要删除的文档
			var query = {
				"name": name,
				"time.day": day,
				"title": title
			};
			collection.findOne(query, function(err, doc){
				if(err){
					client.close();
					return callback(err);
				}
				//如果有reprint_from,即该文章是转载来的，先保存下来reprint_from
				var reprint_from = "";
				if(doc.reprint_info.reprint_from){
					reprint_from = doc.reprint_info.reprint_from
				}
				if(reprint_from != ""){
					//更新原文章所在文档的reprint_to
					collection.update({
						"name": reprint_from.name,
						"time.day": reprint_from.day,
						"title": reprint_from.title
					}, 
					{$pull: {
						"reprint_info.reprint_to": {
							"name": name,
							"day": day,
							"title": title
						}
					}}, 
					function(err){
						if(err){
							client.close();
							return callback(err);
						}
					});
				}
				
				collection.deleteOne(query, function(err, result){
					client.close();
					if(err){
						return callback(err);
					}
					callback(null);
				})
				
			})
			
		})
	});
}

//返回所有文章的存信息
Post.getArchive = function(callback){
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
			
			collection.count({}, function(err, total){
				//返回只包含name、time、title属性的文档组成的数据
				collection.find({}, {
					"name": 1,
					"time": 1,
					"title": 1
				}).sort({time: -1}).toArray(function(err, docs){
					client.close();
					if(err){
						return callback(err);
					}
					callback(null, docs, total);
				})
			})
			
		})
	});
}

//获取所有标签
Post.getTags = function(callback){
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
			
			collection.distinct("tags", function(err, docs){
				client.close();
				if(err){
					return callback(err);
				}
				callback(null, docs);
			})
			
		})
	});
}

//返回特定标签的所有文章
Post.getAllByTag = function(tag, callback){
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
			collection.find({"tags": tag}, {
				"name": 1,
				"time": 1,
				"title": 1
			}).sort({time: -1}).toArray(function(err, docs){
				client.close();
				if(err){
					return callback(err);
				}
				callback(null, docs);
			})
			
		})
	});
}

//查询文章
Post.search = function(keyword, callback){
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
			
			var pattern = new RegExp("^." + keyword + ".*$", "i");
			
			collection.find({"title": pattern}, {
				"name": 1,
				"time": 1,
				"title": 1
			}).sort({time: -1}).toArray(function(err, docs){
				client.close();
				if(err){
					return callback(err);
				}
				callback(null, docs);
			})
			
		})
	});
}

//转载一篇文章
Post.reprint = function(reprint_from, reprint_to, callback){
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
				"name": reprint_from.name,
				"time.day": reprint_from.day,
				"title": reprint_from.title
			};
			collection.findOne(query, function(err, doc){
				if(err){
					client.close();
					return callback(err);
				}
				var date = new Date();
				var time = {
					date: date,
					year: date.getFullYear(),
					month: date.getFullYear() + "-" + (date.getMonth() + 1),
					day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
					minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + ":" + 
							date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes()
				}
				delete doc._id;
				
				doc.name = reprint_to.name;
				doc.time = time;
				doc.title = (doc.title.search(/[转载]/) > -1) ? doc.title : "[转载]" + doc.title;
				doc.comments = [];
				doc.reprint_info = {
					"reprint_from": reprint_from
				}
				doc.pv = 0;
				collection.update({
					"name": reprint_from.name,
					"time.day": reprint_from.day,
					"title": reprint_from.title
				}, {
					$push: {
						"reprint_info.reprint_to":{
							"name": doc.name,
							"day": doc.day,
							"title": doc.title
						}
					}
				}, function(err){
					if(err){
						client.close();
						return callback(err);
					}
				});
				
				collection.insert(doc, {safe: true}, function(err, post){
					client.close();
					if(err){
						return callback(err);
					}
					callback(err, post)
				})
				
			})
			
		})
	});
}