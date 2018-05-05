var MongoClient = require('mongodb').MongoClient;
var settings = require("../settings");

function Comment(name, day, title, comment){
	this.name = name;
	this.day = day;
	this.title = title;
	this.comment = comment;
}

//存储一条留言信息
Comment.prototype.save = function(callback){
	var name = this.name;
	var day = this.day;
	var title = this.title;
	var comment = this.comment;
	MongoClient.connect(settings.dbhost, function(err, client) {
		if(err){
			return callback(err);
		}
		var db = client.db(settings.dbname);
		
		var collection = db.collection('posts');
		//通过用户名、时间以及标题查找文档，并把一条留言对象添加到该文档的comments数组里
		var query = {
			"name": name,
			"time.day": day,
			"title": title
		}
		collection.updateOne(query, {$push:{"comments": comment}}, function(err, result){
			client.close();
			if(err){
				return callback(err);
			}
			callback(null)
		})
	});
}
module.exports = Comment;