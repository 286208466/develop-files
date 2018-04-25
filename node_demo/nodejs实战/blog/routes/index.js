var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var User = require("../models/user.js");
var Post = require("../models/post.js");

router.get('/', function(req, res, next) {
	Post.get(null, function(err, posts){
		if(err){
			posts = [];
		}
		res.render('index', { 
			title: '主页',
			user: req.session.user,
			posts: posts,
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
	var post = new Post(currentUser.name, req.body.title, req.body.post);
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