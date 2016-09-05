var express = require('express');
var path = require('path');
var mongoose = require("mongoose");

var app = express();


//连接数据库
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/serch");
var db = mongoose.connection;

db.on('error',console.error.bind(console,'连接错误'));

var search = new mongoose.Schema({
	name:String,
	title:String,
	detail:String,
	link:Number,
	result:Array,
	page:Number
});

//将Schema发布为Model
jef = db.model('jef',search);

module.exports = jef;