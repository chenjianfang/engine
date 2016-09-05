var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var cheerio = require("cheerio");
var phantom = require('phantom');
app.get('/bug',function(req,res){
		var parat = req.query.name;
		var pn = req.query.page || 0;
		console.log(parat+" "+pn);

		phantom.create().then(function(ph){
			ph.createPage().then(function(page){
				var urlReq = "https://www.baidu.com/s?ie=UTF-8&pn="+pn+"&wd="+encodeURI(parat);
				page.open(urlReq).then(function(status){
					page.property('content').then(function(content){
						// var regResult = content.match(/((result c-container)((?!target)[\s\S])*(target))/g);
						$ = cheerio.load(content);
					
						// for(var i = 0, len = regResult.length; i < len; i++){
						// 	var start = regResult[i].indexOf("href=");
						// 	var end = regResult[i].indexOf("target");
						// 	var splitHref = regResult[i].substring(start+6,end-2);
						// 	link.push(splitHref);
						// }

						var title = []; //标题
						var _link = []; //页面链接
						$("h3.t").each(function(index,ele){
							title.push($(ele).text());
							_link.push($(ele).find("a").attr("href"));
						});

						var detail = []; //描述
						$(".c-abstract").each(function(ind,el){
							detail.push($(el).text());
						});

						res.json({"title":title,"detail":detail,"link":_link});

						page.close();
						ph.exit();
					})
				});
			})
		});



})

module.exports = app;