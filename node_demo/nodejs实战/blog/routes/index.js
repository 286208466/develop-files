var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var fs = require("fs");

var formidable = require('formidable');
var utils = require("../utils.js")

var User = require("../models/user.js");
var Post = require("../models/post.js");
var Comment = require("../models/comment.js");


router.get('/', function(req, res, next) {
	var page = req.query.p ? parseInt(req.query.p) : 1;
	Post.getAll(null, page, function(err, posts, total){
		if(err){
			posts = [];
		}
		res.render('index', { 
			title: '主页',
			posts: posts,
			page: page,
			isFirstPage: (page-1) == 0,
			isLastPage: ((page-1)*10 + posts.length) == total,
			user: req.session.user,
			success: req.flash("success").toString(),
			error: req.flash("error").toString()
		});
	})
	
});

router.get('/login', checkNotLogin);
router.get('/login', function(req, res, next) {
	console.log(req.session.user)
	res.render('login', { 
		title: '登录',
		user: req.session.user,
		success: req.flash("success").toString(),
		error: req.flash("error").toString()
	});
});

router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res, next) {
	res.render('reg', { 
		title: '注册',
		user: req.session.user,
		success: req.flash("success").toString(),
		error: req.flash("error").toString()
	});
});

//router.get('/login', checkLogin);
router.get('/post', function(req, res, next) {
	res.render('post', { 
		title: '发表',
		user: req.session.user,
		success: req.flash("success").toString(),
		error: req.flash("error").toString()
	});
});

//注册
router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res, next) {
	var name = req.body.name;
	var password = req.body.password;
	var confirmpwd = req.body.confirmpwd;
	if(password != confirmpwd){
		req.flash("error", "两次输入的密码不一样");
		return res.redirect("/reg")
	}
	var md5 = crypto.createHash("md5");
	password = md5.update(req.body.password).digest("hex");
	var newUser = new User({
		name: req.body.name,
		password: password,
		email: req.body.email
	});
	
	User.get(newUser.name, function(err, user){
		if(user){
			req.flash("error", "用户已存在")
			return res.redirect("/reg")
		}
		newUser.save(function(err, user){
			if(err){
				req.flash("error", err);
				return res.redirect("/reg")
			}
			console.log("-----", user)
			req.session.user = user;
			req.flash("success", "注册成功");
			res.redirect("/")
		})
	})
});

//登录
router.post('/login', checkNotLogin);
router.post('/login', function(req, res, next) {
	var md5 = crypto.createHash("md5");
	var password = md5.update(req.body.password).digest("hex");
	User.get(req.body.name, function(err, user){
		if(!user){
			req.flash("error", "用户不存在");
			return res.redirect("/login");
		}
		if(user.password != password){
			req.flash("error", "密码错误");
			return res.redirect("/login")
		}
		req.session.user = user;
		req.flash("success", "登录成功");
		res.redirect("/")
	})
});

//发表文章
router.post('/post', checkLogin);
router.post('/post', function(req, res, next) {
	var currentUser = req.session.user;
	var tags = [req.body.tag1, req.body.tag2, req.body.tag3];
	
	var post = new Post(currentUser.name, req.body.title, tags, req.body.post);
	post.save(function(err){
		if(err){
			req.flash("error", err);
			return res.redirect("/")
		}
		req.flash("success", "发布成功");
		res.redirect("/")
	})
});

//退出
router.get('/logout', checkLogin);
router.get('/logout', function(req, res, next) {
	req.session.user = null;
	req.flash("success", "退出成功");
	res.redirect("/");
});

//文件上传
router.get('/upload', checkLogin);
router.get('/upload', function(req, res, next) {
	res.render('upload', { 
		title: '上传',
		user: req.session.user,
		success: req.flash("success").toString(),
		error: req.flash("error").toString()
	});
});

router.post('/upload', checkLogin);
router.post('/upload', function(req, res, next) {
	
	
	var imgLinks = [];
  	var form = new formidable.IncomingForm();
  	form.encoding = "utf-8";
  	form.uploadDir = "public/upload/";
  	//保留后缀
  	form.keepExtensions = true;
  	form.maxFieldsSize = 1024 * 1024 * 1024;
  	form.hash = false;
  	form.multiples = false;

  	form.parse(req, function(err, fields, files) {
      	if (err) {
      		req.flash("error", "文件上传失败")
          	return;
      	}
      	// 遍历所有上传来的图片
      	utils.objForEach(files, function(name, file){
          	if(file.size == 0){
          		fs.unlinkSync(file.path);
          	}else{
          		var name =  new Date().getTime() + "_" + file.name;
              	fs.renameSync(file.path, (form.uploadDir + name));
              	imgLinks.push("/upload/" + name);
          	}
          	
      	});
      	/*utils.json(res, {
          	errno: 0,
          	data: imgLinks
      	});*/
      	req.flash("success", "文件上传成功")
    	res.redirect("/upload")
  	});
	
	
});

router.get("/search", function(req, res, next){
	Post.search(req.query.keyword, function(err, posts){
		if(err){
			req.flash("error", err);
			return res.redirect("/")
		}
		res.render("search", {
			title: "search:" + req.query.keyword,
			posts: posts,
			user: req.session.user,
			success: req.flash("success").toString(),
			error: req.flash("error").toString()
		})
	})
})

//根据用户名、发表日期、标题精确获取一篇文章
router.get("/u/:name", function(req, res, next){
	//检查用户是否存在
	User.get(req.params.name, function(err, user){
		if(!user){
			req.flash("error", "用户不存在");
			return res.redirect("/")
		}
		//查询并返回该用户的所有文章
		var page = req.query.p ? parseInt(req.query.p) : 1;
		Post.getAll(user.name, page, function(err, posts, total){
			if(err){
				req.flash("error", err);
				return res.redirect("/");
			}
			res.render("user", {
				title: user.name,
				posts: posts,
				page: page,
				isFirstPage: (page-1) == 0,
				isLastPage: ((page-1)*10 + posts.length) == total,
				user: req.session.user,
				success: req.flash("success").toString(),
				error: req.flash("error").toString()
			})
		})
		
	})
})

router.get("/u/:name/:day/:title", function(req, res, next){
	Post.getOne(req.params.name, req.params.day, req.params.title, function(err, post){
		if(err){
			req.flash("error", err);
			return res.redirect("/");
		}
		res.render("article", {
			title: req.params.title,
			post: post,
			user: req.session.user,
			success: req.flash("success").toString(),
			error: req.flash("error").toString()
		})
	})
})
router.post("/u/:name/:day/:title", function(req, res, next){
	var date = new Date();
	var time = date.getTime();
	var comment = {
		name: req.body.name,
		email: req.body.email,
		website: req.body.website,
		time: time,
		content: req.body.content
	}
	var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
	newComment.save(function(err){
		if(err){
			req.flash("error", err);
			return res.redirect("back");
		}
		req.flash("success", "留言成功")
		res.redirect("back");
	})
})

router.get("/edit/:name/:day/:title", checkLogin);
router.get("/edit/:name/:day/:title", function(req, res, next){
	Post.getOne(req.session.user.name, req.params.day, req.params.title, function(err, post){
		if(err){
			req.flash("error", err);
			return res.redirect("/");
		}
		res.render("edit", {
			title: "编辑",
			post: post,
			user: req.session.user,
			success: req.flash("success").toString(),
			error: req.flash("error").toString()
		})
	})
})

router.post("/edit", checkLogin);
router.post("/edit", function(req, res, next){
	var user = req.session.user;
	var day = req.body.day;
	var title = req.body.title;
	var post = req.body.post
	Post.update(user.name, day, title, post, function(err){
		var url = "/u/" + user.name + "/" + day + "/" + title;
		if(err){
			req.flash("error", err);
			return;
		}
		req.flash("success", "修改成功");
		res.redirect(url);
	})
})

router.get("/remove/:name/:day/:title", checkLogin);
router.get("/remove/:name/:day/:title", function(req, res, next){
	Post.remove(req.session.user.name, req.params.day, req.params.title, function(err){
		if(err){
			req.flash("error", err);
			return res.redirect("back");
		}
		req.flash("success", "删除成功");
		res.redirect("/");
	})
})

router.get("/archive", function(req, res, next){
	Post.getArchive(function(err, posts, total){
		if(err){
			req.flash("error", err);
			return res.redirect("/");
		}
		res.render("archive", {
			title: "存档",
			posts: posts,
			user: req.session.user,
			success: req.flash("success").toString(),
			error: req.flash("error").toString()
		})
	})
})

router.get("/tags", function(req, res, next){
	Post.getTags(function(err, posts){
		if(err){
			req.flash("error", err);
			return res.redirect("/");
		}
		res.render("tags", {
			title: "标签",
			posts: posts,
			user: req.session.user,
			success: req.flash("success").toString(),
			error: req.flash("error").toString()
		})
	})
})

router.get("/tags/:tag", function(req, res, next){
	Post.getAllByTag(req.params.tag, function(err, posts){
		if(err){
			req.flash("error", err);
			return res.redirect("/");
		}
		res.render("tag", {
			title: "Tag:" + req.params.tag,
			posts: posts,
			user: req.session.user,
			success: req.flash("success").toString(),
			error: req.flash("error").toString()
		})
	})
})

router.get("/reprint/:name/:day/:title", checkLogin);
router.get("/reprint/:name/:day/:title", function(req, res, next){
	Post.edit(req.params.name, req.params.day, req.params.title, function(err, post){
		if(err){
			req.flash("error", err);
			return res.redirect("back");
		}
		var currentUser = req.session.user;
		var reprint_from = {name: post.name, day: post.time.day, title: post.title};
		var reprint_to = {name: currentUser.name};
		console.log("posts2-----------", reprint_to)
		Post.reprint(reprint_from, reprint_to, function(err, post2){
			if(err){
				req.flash("error", err);
				return res.redirect("back");
			}
			req.flash("success", "转载成功");
			var url = "/u/" + post.name + "/" + post.time.day + "/" + post.title;
			res.redirect(url);
		})
	})
})

module.exports = router;

function checkLogin(req, res, next){
	if(!req.session.user){
		req.flash("error", "未登录");
		res.redirect("/login");
	}
	next();
}
function checkNotLogin(req, res, next){
	if(req.session.user){
		req.flash("error", "已登录");
		res.redirect("back");
	}
	next();
}