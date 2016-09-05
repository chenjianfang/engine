var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./router/router');
var PersonModel = require('./router/db');
var zsgc = require('./router/zsgc');
var bug = require('./router/bug');
// var session = require('./router/session');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/',routes);
app.use('/',zsgc);
app.use('/',bug);
// app.use('/',session);
app.post('/FMval',function(req,res){
	/*
	* @parat //name:用户名；//pass：输入的密码
	*/
	PersonModel.find({'name':req.body.name},function(err,docs){
		console.log(docs.length);
		if(docs.length === 0){
			//保存到数据库
			var parat = {
				name:req.body.name,
				pass:req.body.pass
			}
			PersonModel.create(parat,function(err,small){
				if(err){
					res.json({status:"0003",error:"新增用户失败"})
				}else{
					res.json({status:"0000",error:"新增用户成功"})
				}
			});
		}else{
			res.json({status:"0001",error:"该用户名已注册"})
		}
		// res.send({name:docs.name,pass:docs.pass});
	});
});




app.listen(1337)

