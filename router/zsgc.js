var express = require('express');
var path = require('path');
var PersonModel = require('./db');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({
	extended: false,
	uploadDir:"./public/upload",
	limit:1000000,
	keepExtensions:true,
	defer:true
	})
);
app.use(bodyParser.json());

app.get('/delLogging',function(req,res){
	console.log("删除请求进来了");
	/*
	*@parat 删除key为name的数据
	*/
	PersonModel.find({'name':req.body.name},function(err,docs){
		if(docs.length === 0){
			res.json({status:"0002",error:"此用户名不存在"})
		}else{
			PersonModel.remove({'name':req.body.name},function(){
				res.json({status:"0000",error:"删除成功"})
			});
		}
	});
});
app.post('uploadIMG',function(req,res){
	console.log(req.files);
	var pathArr = req.files.file.path.split("\\");
	res.send(pathArr[pathArr.length-1]);
});

/*跨域请求测试*/
app.get('/crossDomain',function(req,res){
	var obj = {
		"domain":"你好啊，这是跨域的response！"
	}
	res.jsonp(obj);
});
module.exports = app;