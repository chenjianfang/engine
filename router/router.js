var express = require('express');
var dbmodel = require('./db');
var router = express.Router();
var app = express();
var request = require("request");

router.get('/bug.html',function(req,res){

});
router.get('/main.html',function(req,res){

});

//------------搜索请求--------
var lockClick = 1;
router.post('/serch',function(req,res){

	var cheerio = require("cheerio");
	var phantom = require('phantom');
	var parat = req.body.name;
	var pn = req.body.page || 0;
	console.log(parat+" "+pn);

	
	//数据库是否有，如果有就从数据库中取，没有就爬百度，然后保存到数据库
	dbmodel.findOne({name:parat,page:pn},function(err,docs){
		if(docs){
			res.json({"success":docs.result});
		}else{
			//循环爬函数
			var sePage = 0;  //当前爬到的页面数
			function serch(){
				if(sePage === 100){
					return false;
				};
				dbmodel.findOne({name:parat,page:sePage},function(err,doc){
					if(doc){
						// res.json({"success":doc.result});
						
						sePage += 10;
						serch();
						
					}else{
						phantom.create().then(function(ph){
							ph.createPage().then(function(page){
								var urlReq = "https://www.baidu.com/s?ie=UTF-8&pn="+sePage+"&wd="+encodeURI(parat);
								page.open(urlReq).then(function(status){
									page.property('content').then(function(content){
										$ = cheerio.load(content);
										
										var wrapper = [];//所有爬到的数据
										$(".c-container").each(function(index,ele){
											var _title = $(ele).find("h3.t").text(); //标题
											var _detail = $(ele).find(".c-abstract").text(); //描述
											var _link = $(ele).find("h3.t a").attr("href"); //链接
											wrapper.push({"title":_title,"detail":_detail,"link":_link});
										});

										if(sePage === 0){
											res.json({"success":wrapper});
										}

										var serchEntity = new dbmodel({"name":parat,"page":sePage,"result":wrapper})
										serchEntity.save(function(err){
											console.log(err);
										});
										
										sePage += 10;
										serch();
										
										page.close();
										ph.exit();
									})
								});
							})
						});
					}
					
				});
			}

			//搜索
			dbmodel.findOne({name:parat,page:0},function(err,doc){
				if(doc){
					phantom.create().then(function(ph){
						ph.createPage().then(function(page){
							var urlReq = "https://www.baidu.com/s?ie=UTF-8&pn="+pn+"&wd="+encodeURI(parat);
							page.open(urlReq).then(function(status){
								page.property('content').then(function(content){
									$ = cheerio.load(content);
									
									var wrapper = [];//所有爬到的数据
									$(".c-container").each(function(index,ele){
										var _title = $(ele).find("h3.t").text(); //标题
										var _detail = $(ele).find(".c-abstract").text(); //描述
										var _link = $(ele).find("h3.t a").attr("href"); //链接
										wrapper.push({"title":_title,"detail":_detail,"link":_link});
									});
									res.json({"success":wrapper});

									page.close();
									ph.exit();
								})
							});
						})
					});
				}else{
					var ser = new serch();
					ser = null;
				}
			});			
		}
	});
});

//----------字典暴力搜索
router.post('/bigserch',function(req,res){
	var cheerio = require("cheerio");
	var phantom = require('phantom');
	var parat = req.body.name;
	var pn = req.body.page || 0;
	console.log(parat+" "+pn);

	//数据库是否有，如果有就从数据库中取，没有就爬百度，然后保存到数据库
	dbmodel.findOne({name:parat,page:pn},function(err,docs){
		console.log(docs);
		if(docs){
			res.json({"had":"1"});
		}else{

			phantom.create().then(function(ph){
				ph.createPage().then(function(page){
					var urlReq = "https://www.baidu.com/s?ie=UTF-8&pn="+pn+"&wd="+encodeURI(parat);
					page.open(urlReq).then(function(status){
						page.property('content').then(function(content){
							$ = cheerio.load(content);
							
							var wrapper = [];//所有爬到的数据
							$(".c-container").each(function(index,ele){
								var _title = $(ele).find("h3.t").text(); //标题
								var _detail = $(ele).find(".c-abstract").text(); //描述
								var _link = $(ele).find("h3.t a").attr("href"); //链接
								wrapper.push({"title":_title,"detail":_detail,"link":_link});
							});
							res.json({"success":"1"});
							console.log(parat);
							var serchEntity = new dbmodel({"name":parat,"page":pn,"result":wrapper})
							serchEntity.save(function(err){
								console.log(err)
							});

							page.close();
							ph.exit();
						})
					});
				})
			});

		}
	});
});


module.exports = router;









