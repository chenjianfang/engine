var express = require('express');
var session = require('express-session');

var app= express();

app.use(session({
	secret:'recommand 128 bytes random string',
	cookie:{maxAge:60*1000*5}
}));

app.get('/session',function(req,res){
	if(req.session.isVisit){
		req.session.isVisit++;
		console.log(req.session.isVisit);
	}else{
		req.session.isVisit = 1;
		res.send('第一次来哦');
		console.log(req.session);
	}
});

module.exports = app;