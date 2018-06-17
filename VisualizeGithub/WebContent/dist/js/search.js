var apiSearchUrl = "https://api.github.com/search/";
var access_token = "access_token=727d34d1872545e5859ec1c969dea1f93a20d253"

var language,pushed;
$(document).ready(function(){
	language="";
	pushed="";
	//append select的option
	//搜尋按鈕
	$("#searchButton").click(function(){
		var date = new Date();
		var Year = date.getFullYear()
		var Mon = date.getMonth() + 1
		var Day = date.getDate();
		if(Mon < 10)Mon = "0"+Mon;
		//算時間，一年以上(包含)
		if($("#date").val()>=365){
			Year -= ($("#date").val()/365);
		}
		//一個月以上(包含)，一年以下
		if(($("#date").val()%365)>=30 && ($("#date").val()%365)<365){
			Mon -= Math.floor((($("#date").val()%365)/30));
			if(Mon <= 0){
				Mon = 12+Mon;
				Year -= 1;
			}
			if(Mon<10){
				Mon = "0"+Mon;
			}
		}
		//一個月以內
		if((($("#date").val()%365)%30)<30 && (($("#date").val()%365)%30)>0){
			Day -=(($("#date").val()%365)%30);	
			if(Day<10)Day = "0"+Day;
		}
		//設定程式語言
		if($("#language").val()!="")language = "+language:"+$("#language").val();
		//設定時間限制
		if($("#date").val()!="")pushed = "+pushed:>"+Year+"-"+Mon+"-"+Day;
		console.log(apiSearchUrl+$("#type").val()+"?q="+$("#searchText").val()+language+pushed+"&sort=stars&order=desc&per_page=100&"+access_token);
		$.ajax({
			url:apiSearchUrl+$("#type").val()+"?q="+$("#searchText").val()+language+pushed+"&sort=stars&order=desc&per_page=100&"+access_token,
			cache:false,
			success:function(response){
				//第一次默認會是抓page=1的，也就是前100個item
				printResult(response,$("#type").val(),i);
				//每一次抓回來的item最多是100，所以如果total_count超過100，就要分次抓
				for(var i = 2;i <= ((response.total_count/100)+1);i++){
					console.log(apiSearchUrl+$("#type").val()+"?q="+$("#searchText").val()+language+pushed+"&sort=stars&order=desc&page="+i+"&per_page=100&"+access_token);
					$.ajax({
						url:apiSearchUrl+$("#type").val()+"?q="+$("#searchText").val()+language+pushed+"&sort=stars&order=desc&page="+i+"&per_page=100&"+access_token,
						cache:false,
						async: false,
						success:function(response){
							printResult(response,$("#type").val());
							
						},
						error:function(e){
							console.log("search error");
						}
					});
				}
				
			},
			error:function(e){
				console.log("search error");
			}
		});
	});
	var img;
	//star排行榜
	$.ajax({
		method: "POST",
    	url: "https://api.github.com/graphql",
    	contentType: "application/json",
      	headers: {
        	Authorization: "bearer 727d34d1872545e5859ec1c969dea1f93a20d253"
      	},
      	data: JSON.stringify({
      		query:
      		'{'
      		+'search(query: "stars:>100000 sort:stars-desc", type: REPOSITORY, first: 3) {'
      			+'edges {'
					+'node {'
						+'... on Repository {'
				        	+'nameWithOwner '
				          	+'description '
				       	+'}'
					+'}'
				+'}'
			+'}'
			+'}'
		}),
		cache:false,
		success:function(response){
			for(var i = 0;i < 3;i++){
				if(i==0)img = '<img class="rotate" src="img/icon/銀牌.jpg" alt="Generic placeholder image" style="width:160px;height:160px">';
				else if(i==1)img = '<img class="rotate" src="img/icon/金牌.jpg" alt="Generic placeholder image" style="width:200px;height:200px">';
				else img = '<img class="rotate" src="img/icon/銅牌.jpg" alt="Generic placeholder image" style="width:120px;height:120px">';
				$("#starLeaderboard").append('<div class="col-sm-4 wow fadeInDown text-center">'
						+img
						+'<h3 class="ellipsis">'+response.data.search.edges[i].node.nameWithOwner+'</h3>'
						+'<p class="lead">'+response.data.search.edges[i].node.description+'</p>'
						+'<p><a href="https://github.com/'+response.data.search.edges[i].node.nameWithOwner+'" class="btn btn-embossed btn-primary view" role="button" style="margin-right:10px;">分析</a>'
						+'<a href="https://github.com/'+response.data.search.edges[i].node.nameWithOwner+'" class="btn btn-embossed btn-primary view" role="button">連結</a></p>'
						+'</div>');
				$('.ellipsis').tooltip({title:response.items[i].full_name ,  placement:"bottom", animation: true});
			}
		},
		error:function(e){
			console.log("star trending init error");
		}
	});
	//fork排行榜
	$.ajax({
		method: "POST",
    	url: "https://api.github.com/graphql",
    	contentType: "application/json",
      	headers: {
        	Authorization: "bearer 727d34d1872545e5859ec1c969dea1f93a20d253"
      	},
      	data: JSON.stringify({
      		query:
      		'{'
      		+'search(query: "forks:>30000 sort:forks-desc", type: REPOSITORY, first: 3) {'
      			+'edges {'
					+'node {'
						+'... on Repository {'
				        	+'nameWithOwner '
				          	+'description '
				       	+'}'
					+'}'
				+'}'
			+'}'
			+'}'
		}),
		cache:false,
		success:function(response){
			for(var i = 0;i < 3;i++){
				if(i==0)img = '<img class="rotate" src="img/icon/銀牌.jpg" alt="Generic placeholder image" style="width:160px;height:160px">';
				else if(i==1)img = '<img class="rotate" src="img/icon/金牌.jpg" alt="Generic placeholder image" style="width:200px;height:200px">';
				else img = '<img class="rotate" src="img/icon/銅牌.jpg" alt="Generic placeholder image" style="width:120px;height:120px">';
				$("#forkLeaderboard").append('<div class="col-sm-4 wow fadeInDown text-center">'
						+img
						+'<h3 class="ellipsis">'+response.data.search.edges[i].node.nameWithOwner+'</h3>'
						+'<p class="lead">'+response.data.search.edges[i].node.description+'</p>'
						+'<p><a href="https://github.com/'+response.data.search.edges[i].node.nameWithOwner+'" class="btn btn-embossed btn-primary view" role="button" style="margin-right:10px;">分析</a>'
						+'<a href="https://github.com/'+response.data.search.edges[i].node.nameWithOwner+'" class="btn btn-embossed btn-primary view" role="button">連結</a></p>'
						+'</div>');
				$('.ellipsis').tooltip({title:response.items[i].full_name ,  placement:"bottom", animation: true});
			}
		},
		error:function(e){
			console.log("fork trending init error");
		}
	});
	// $.ajax({
 //    	method: "POST",
 //    	url: "https://api.github.com/graphql",
 //    	contentType: "application/json",
 //      	headers: {
 //        	Authorization: "bearer 727d34d1872545e5859ec1c969dea1f93a20d253"
 //      	},
 //      	data: JSON.stringify({
 //      		query:
 //      			'{'
	// 			  +'search(query: "language:JavaScript stars:>100", type: REPOSITORY, first: 100) {'
	// 			   +' repositoryCount '
	// 			   +' userCount '
	// 			    +'edges {'
	// 			      +'node {'
	// 			        +'... on Repository {'
	// 			          +'name '
	// 			          +'descriptionHTML '
	// 			          +'stargazers {'
	// 			           +'totalCount'
	// 			          +'}'
	// 			          +'forks {'
	// 			           +' totalCount'
	// 			          +'}'
	// 			         +' updatedAt'
	// 			       +' }'
	// 			     +' }'
	// 			    +'}'
	// 			  +'}'
	// 			+'}'
	// 	}),
	// 	success:function(res){
	// 		console.log(res);
	// 	},
	// 	error:function(e){
	// 		console.log("test error");
	// 	}
	// });
//輸出專案搜尋結果
function printResult(response,type,page){
	//專案的全名(包含user)/專案名稱
	var fullName,name;
	var apiTypeUrl
	console.log(response)
	if(type == "repositories")apiTypeUrl = "https://api.github.com/repos/";
	// else if(type == "code"){}
	// else if(type == "commits"){}
	// else if(type == "issues"){}
	// else if(type == "users"){}
	// else if(type == "topics"){}
	//languageArray各個搜尋結果的小圖，allLanguageArray所有搜尋結果的大圖
	var languageArray=[],allLanguageArray=[];
	//大圖要的資料
	var allForkArray=[],allStarArray=[],allWatchArray=[],allPullRequestArray=[];
	var starObject,languageObject,forkObject,watchObject,pullRequestObject;
	//總共有幾個page
	var count = 100;
	if(page == ((response.total_count/100)+1))count = response.total_count%100;
	for(var i = 0;i < count;i++){
		console.log(i)
		fullName = response.items[i].full_name;
		console.log(fullName)
		name = response.items[i].name;
		//拿該專案所使用的所有language
		$.ajax({
			url:apiTypeUrl+fullName+"/languages?"+access_token,
			cache:false,
			success:function(res){
				languageArray = [];
				for(var index in res){
					languageObject = {"data":index,"value":res[index]};
					languageArray.push(languageObject);
				}
				//將各個小圖片的結果合併成大圖
				languageArray.forEach(function(item){
				    var data = item.data,value = item.value ;
				    if(allLanguageArray.hasOwnProperty(data)){
				       allLanguageArray[data].value += value
				    }else{
				        allLanguageArray[data] = {
				            'data' : data,
				            'value' : value
				        }
				    }
				});
				// console.log(allLanguageArray)
			},
			// var entry = $('#entry').val()
			 
			error:function(e){
				console.log("get language error");
			}
		});

		//拿所有搜尋結果的fork
		forkObject = {"data":name,"value":response.items[i].forks};
		allForkArray.push(forkObject);

		//拿所有搜尋結果的star
		starObject = {"data":name,"value":response.items[i].stargazers_count};
		allStarArray.push(starObject);
		//拿所有搜尋結果的watch
		$.ajax({
			url:apiTypeUrl+fullName+"/subscribers?"+access_token,
			cache:false,
			async: false,
			success:function(res){
				// console.log(res.length)
				watchObject = {"data":name,"value":res.length};
				allWatchArray.push(watchObject);
			},
			error:function(e){
				console.log("get watch error");
			}
		});

		//拿所有搜尋結果的pull request
		$.ajax({
			url:apiTypeUrl+fullName+"/pulls?"+access_token,
			cache:false,
			async: false,
			success:function(res){
				// console.log(res.length)
				pullRequestObject = {"data":name,"value":res.length};
				allPullRequestArray.push(pullRequestObject);
				// console.log(allPullRequestArray)
			},
			error:function(e){
				console.log("get pull request error");
			}
		});
	}
}
})