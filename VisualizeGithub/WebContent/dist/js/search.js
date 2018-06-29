
var language,pushed,created;

// parameter
var ftoken = "bearer 7b2797e105897080e19b0eba56428fe55a8945ba";
var stoken = "bearer 2ceafa42746ddaa6e4bfa923e120ad5b7c0c0b7e";
var pType;
var pL;
var pDate;
var pText;
var date = new Date();
var Year = date.getFullYear()
var Mon = date.getMonth() + 1
var Day = date.getDate();

function get(name)
{
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}	

$(document).ready(function(){
	
	/*for(var i=0;i<15;i++)
{
	$("#pageResult").append('<div class="w3-row" style="border-bottom:5px black solid;padding:15px;">'
				+'<div class="w3-col" style="width:60%;height:150px">'
						+'<a href="">'
						+'<p>專案名稱:XXXXXXXXXX</p>'
						+'<p>簡介:123456789</p>'
						+'</a>'
					+'</div>'
					+'<div class="w3-col" style="width:5%;height:150px"></div>'
					+'<div class="w3-col" style="width:30%;height:150px">'
						+'<a href="">'
						+'<img src="test圖.jpg" style="width:auto;height:95%;"></img>'
						+'</a>'					
					+'</div>'	
				+'</div>')
}*/
	language="";
	pushed="";

	pType = get('type');
	pL = get('l');
	pDate = get('date');
	pText = get('text');

	doingSearch();	

	//append select的option
	//搜尋按鈕

})

// 搜尋方法
function doingSearch(){
	var date = new Date();
	var Year = date.getFullYear()
	var Mon = date.getMonth() + 1
	var Day = date.getDate();

	if(Mon < 10)Mon = "0"+Mon;
	//算時間，一年以上(包含)
	if(pDate>=365){
		Year -= (pDate/365);
	}
	//一個月以上(包含)，一年以下
	if((pDate%365)>=30 && (pDate%365)<365){
		Mon -= Math.floor(((pDate%365)/30));
		if(Mon <= 0){
			Mon = 12+Mon;
			Year -= 1;
		}
		if(Mon<10){
			Mon = "0"+Mon;
		}
	}
	//一個月以內
	if((((pDate%365)%30)<30 && (pDate%365)%30)>0){
		Day -=((pDate%365)%30);	
		if(Day<10)Day = "0"+Day;
	}
	//設定程式語言
	if(pL!="")language = "language:"+pL;
	//設定時間限制
	if(pDate!="" && pDate!=0){
		pushed = "pushed:>"+Year+"-"+Mon+"-"+Day;
		created = "created:>"+Year+"-"+Mon+"-"+Day;
	}
	// console.log(apiSearchUrl+pType+"?q="+$("#searchText").val()+language+pushed+"&sort=stars&order=desc&per_page=100&"+access_token);

	var check=true,cursor="";
	//repository
	if(pType == "REPOSITORY"){
		//跑搜尋結果。一個query只能抓100個edge，所以要用迴圈，然後每次都抓該組的pageInfo中的hasNextPage，去判斷
		//如果hasNextPage是true，就要把endCursor放在after中
		console.log(pText)
		console.log(language)
		console.log(pushed)
		while(check){
			$.ajax({
		    	method: "POST",
		    	url: "https://api.github.com/graphql",
		    	contentType: "application/json",
		    	cache:false,
		    	//取消非同步
		    	async:false,
		      	headers: {
		        	Authorization: ftoken
		      	},
		      	data: JSON.stringify({
		      		query:
		      			'{'
						  +'search(query: "'+pText+' '+language+' '+pushed+' sort:stars-desc", type: REPOSITORY, first: 100'+cursor+') {'
						    +'edges {'
						      +'node {'
						        +'... on Repository {'
						          +'url '
						          +'owner{'
						            +'login'
						          +'}'
						          +'name '
						          +'description '
						          +'repositoryTopics(first:10){'
						            +'edges{'
						              +'node{'
						                +'topic{'
						                  +'name'
						                +'}'
						              +'}'
						            +'}'
						          +'}'
						        +'}'
						      +'}'
						    +'}'
						    +'pageInfo{'
						    	+'hasNextPage '
						     	+'endCursor'
						    +'}'
						  +'}'
						+'}'
				}),
				success:function(response){
					console.log(response)
					// console.log(response.data.search.pageInfo.hasNextPage)
					check = response.data.search.pageInfo.hasNextPage;
					cursor = ',after:"'+response.data.search.pageInfo.endCursor+'"';

					printRepositoryResult(response,response.data.search.edges.length);
				},
				error:function(e){
					console.log("search repository error");
				}
			});
		}
	}
	//user
	else if(pType == "USER"){
		while(check){
			$.ajax({
		    	method: "POST",
		    	url: "https://api.github.com/graphql",
		    	contentType: "application/json",
		    	cache:false,
		    	//取消非同步
		    	async:false,
		      	headers: {
		        	Authorization: ftoken
		      	},
		      	data: JSON.stringify({
		      		query:
		      			'{'
						  +'search(query: "'+pText+' '+language+'", type: USER, first: 100'+cursor+') {'
						    +'edges {'
						      +'node {'
						        +'... on User {'
						          +'url '
						          +'name '
						          +'login '
						          +'location '
						          +'bio '//自我介紹
						        +'}'
						      +'}'
						    +'}'
						    +'pageInfo{'
						    	+'hasNextPage '
						     	+'endCursor'
						    +'}'
						  +'}'
						+'}'
				}),
				success:function(response){
					check = response.data.search.pageInfo.hasNextPage;
					cursor = ',after:"'+response.data.search.pageInfo.endCursor+'"';

					printUserResult(response,response.data.search.edges.length);
				},
				error:function(e){
					console.log("search user error");
				}
			});
		}
		drawPie(convertToD3Data(allUserStarArray), '#bigChart' , 400, 400, '#color-legend-area');
		changeBtndiv(1);
	}
	//issue
	else if(pType == "ISSUE"){
		while(check){
			$.ajax({
		    	method: "POST",
		    	url: "https://api.github.com/graphql",
		    	contentType: "application/json",
		    	cache:false,
		    	//取消非同步
		    	async:false,
		      	headers: {
		        	Authorization: ftoken
		      	},
		      	data: JSON.stringify({
		      		query:
		      			'{'
						  +'search(query: "'+pText+' '+language+' '+created+'", type: ISSUE, first: 100'+cursor+') {'
						    +'edges {'
						      +'node {'
						        +'... on Issue {'
						          +'url '
						          +'repository{'
						            +'owner {'
						             +'login '
						            +'}'
						            +'name'
						          +'}'
						          +'title '
						          +'updatedAt '
						          +'body '
								  +'participants{'
						            +'totalCount'
						          +'}'
						          +'labels{'
						            +'totalCount'
						          +'}'
						          +'comments{'
						            +'totalCount'
						          +'}'
						        +'}'
						      +'}'
						    +'}'
						    +'pageInfo{'
						    	+'hasNextPage '
						     	+'endCursor'
						    +'}'
						  +'}'
						+'}'
				}),
				success:function(response){
					console.log(response);
					// console.log(response.data.search.edges.length)
					// console.log(response.data.search.pageInfo.hasNextPage)
					check = response.data.search.pageInfo.hasNextPage;
					cursor = ',after:"'+response.data.search.pageInfo.endCursor+'"';

					printIssueResult(response,response.data.search.edges.length);
				},
				error:function(e){
					console.log("search error");
				}
			});
		}
		drawPie(convertToD3Data(allIssueParticipantArray), '#bigChart' , 400, 400, '#color-legend-area');
		changeBtndiv(2);
	}
}

//languageArray各個搜尋結果的小圖
var languageArray=[];
//大圖要的資料，repository
var allRepositoryLanguageArray=[],allRepositoryForkArray=[],allRepositoryStarArray=[];
var allRepositoryWatchArray=[],allRepositoryPullRequestArray=[],allRepositoryIssueArray=[];
//大圖要的資料，user
var allUserIssueArray=[],allUserFollowersArray=[],allUserFollowingArray=[],allUserRepositoriesArray=[];
var allUserPullRequestArray=[],allUserStarArray=[],allUserWatchingArray=[];

//大圖要的資料，issue
var allIssueParticipantArray=[],allIssueLabelArray=[],allIssueCommentArray=[];
var languageObject,object;

// 搜尋結果陣列
var searchResultArray = [];
// 各搜尋結果語言 (未排序)
var eachLangArray = new Map();

//輸出"repository"搜尋結果
function printRepositoryResult(response,length){
	var name,login;
	var promises = [];

	//總共有幾個page
	for(var i = 0;i < length;i++){
		name = response.data.search.edges[i].node.name;
		login = response.data.search.edges[i].node.owner.login;
		//拿該專案有用到的所有language
		var langPromise = $.ajax({
			method: "POST",
	    	url: "https://api.github.com/graphql",
	    	contentType: "application/json",
	      	headers: {
	        	Authorization: stoken
	      	},
	      	data: JSON.stringify({
	      		query:
	      		'query{'
				  +'repository(owner:"'+login+'",name:"'+name+'"){'
				    +'owner {'
				      +'login'
				    +'}'
				    +'name '
				    +'languages(first:20){'
				      +'edges{'
				        +'node{'
				          +'name'
				        +'}'
				        +'size'
				      +'}'
				    +'}'
				  +'}'
				+'}'
			}),
			cache:false,
			success:function(resp){
				 console.log(resp);
				// console.log('name: ' + resp.data.repository.name + '  lang: ' + resp.data.repository.languages.edges);

				languageArray = [];
				for(var j = 0;j < resp.data.repository.languages.edges.length;j++){
					languageObject = {"repository":resp.data.repository.owner.login + '/' + resp.data.repository.name
					,"data":resp.data.repository.languages.edges[j].node.name
					,"value":resp.data.repository.languages.edges[j].size};
					languageArray.push(languageObject);
				}
				// 設定 map
				eachLangArray.set(languageArray[0].repository, languageArray);
				//將各個小圖片的結果合併成大圖
				languageArray.forEach(function(item){
				    var data = item.data,value = item.value ;
				    if(allRepositoryLanguageArray.hasOwnProperty(data)){
				       allRepositoryLanguageArray[data].value += value
				    }else{
				        allRepositoryLanguageArray[data] = {
				            'data' : data,
				            'value' : value
				        }
				    }
				});
			},
			 
			error:function(e){
				console.log("get language error");
			}
		});
		//拿所有搜尋結果的不同資料的數量
		var resultPromise = $.ajax({
			method: "POST",
	    	url: "https://api.github.com/graphql",
	    	contentType: "application/json",
	      	headers: {
	        	Authorization: stoken
	      	},
	      	data: JSON.stringify({
	      		query:
	      		'query{'
					  +'repository(owner:"'+login+'",name:"'+name+'"){'
					  	+'name '
					  	+'stargazers{'
					      +'totalCount'
					    +'}'
					    +'forkCount '
					    +'watchers{'
					      +'totalCount'
					    +'}'
					    +'pullRequests{'
					      +'totalCount'
					    +'}'
					    +'issues{'
					      +'totalCount'
					    +'}'
					  +'}'
					+'}'
				}),
				cache:false,
				success:function(resp){
					//star
					object = {"data":resp.data.repository.name,"value":resp.data.repository.stargazers.totalCount};
					allRepositoryStarArray.push(object);
					//fork
					object = {"data":resp.data.repository.name,"value":resp.data.repository.forkCount};
					allRepositoryForkArray.push(object);
					//watch
					object = {"data":resp.data.repository.name,"value":resp.data.repository.watchers.totalCount};
					allRepositoryWatchArray.push(object);
					//pullrequest
					object = {"data":resp.data.repository.name,"value":resp.data.repository.pullRequests.totalCount};
					allRepositoryPullRequestArray.push(object);
					//issue
					object = {"data":resp.data.repository.name,"value":resp.data.repository.issues.totalCount};
					allRepositoryIssueArray.push(object);
					
				},
				error:function(e){
					console.log("get watch error");
				}
		})
		// 將 Promise 放入陣列
		promises.push(langPromise);
		promises.push(resultPromise);
		// 放搜尋結果到陣列
		searchResultArray.push({title: login + '/' + name, description: response.data.search.edges[i].node.description, url: response.data.search.edges[i].node.url, topic: response.data.search.edges[i].node.repositoryTopics.edges});
	};
	// 等待所有 Ajax 完成後
	Promise.all(promises).then(function(){
		// 把 map 所有的 value 取出來回傳回陣列
		allRepositoryLanguageArray = Object.values(allRepositoryLanguageArray);
		// 畫大圖
		drawPie(convertToD3Data(allRepositoryLanguageArray), '#bigChart' , 400, 400, '#color-legend-area');
		// 設置搜尋結果的 language 
		for (var i = 0; i < searchResultArray.length; i++)
		{
			searchResultArray[i].language = eachLangArray.get(searchResultArray[i].title);
		}
		// 畫前十筆結果圓餅圖
		for (var i = 0; i < 10; i++)
		{
		    drawPie(searchResultArray[i].language, '#smallChart-' + i, 175, 175, null);
		}
		changeBtndiv(0);
	})
}
//輸出"user"搜尋結果
function printUserResult(response,length){
	var login;
	var userPromises = [];
	// //總共有幾個page
	// console.log(response);
	// console.log(length);
	for(var i = 0;i < length;i++){
		login = response.data.search.edges[i].node.login;
		//拿所有搜尋結果的不同資料的數量，然後塞入陣列
		var userPromise = $.ajax({
			method: "POST",
	    	url: "https://api.github.com/graphql",
	    	contentType: "application/json",
	      	headers: {
	        	Authorization: stoken
	      	},
	      	data: JSON.stringify({
	      		query:
	      		'query{'
					  +'user(login:"'+login+'"){'
					  	+'login '
					  	+'name '
					  	+'pullRequests{'
					      +'totalCount'
					    +'}'
					    +'issues{'
					      +'totalCount'
					    +'}'
					    +'followers{'
					      +'totalCount'
					    +'}'
					    +'following{'
					      +'totalCount'
					    +'}'
					    +'starredRepositories{'
					      +'totalCount'
					    +'}'
					    +'repositories{'
					      +'totalCount'
					    +'}'
					    +'watching{'
					      +'totalCount'
					    +'}'
					  +'}'
					+'}'
				}),
				cache:false,
				success:function(resp){
					// console.log(resp);
					// console.log(resp.data.user.login);
					//pullrequest
					if (resp.data.user.pullRequests.totalCount != 0)
					{
						object = {"data":resp.data.user.login + (resp.data.user.name != null && resp.data.user.name != '' ? ('/' + resp.data.user.name) : ''), "value":resp.data.user.pullRequests.totalCount};
						allUserPullRequestArray.push(object);
					}
					//issue
					if (resp.data.user.issues.totalCount != 0)
					{
						object = {"data":resp.data.user.login + (resp.data.user.name != null && resp.data.user.name != '' ? ('/' + resp.data.user.name) : ''),"value":resp.data.user.issues.totalCount};
						allUserIssueArray.push(object);
					}
					//followers
					if (resp.data.user.followers.totalCount != 0)
					{
						object = {"data":resp.data.user.login + (resp.data.user.name != null && resp.data.user.name != '' ? ('/' + resp.data.user.name) : ''),"value":resp.data.user.followers.totalCount};
						allUserFollowersArray.push(object);
					}
					//following
					if (resp.data.user.following.totalCount != 0)
					{
						object = {"data":resp.data.user.login + (resp.data.user.name != null && resp.data.user.name != '' ? ('/' + resp.data.user.name) : ''),"value":resp.data.user.following.totalCount};
						allUserFollowingArray.push(object);
					}
					//star
					if (resp.data.user.starredRepositories.totalCount != 0)
					{
						object = {"data":resp.data.user.login + (resp.data.user.name != null && resp.data.user.name != '' ? ('/' + resp.data.user.name) : ''),"value":resp.data.user.starredRepositories.totalCount};
						allUserStarArray.push(object);
					}
					//repositories
					if (resp.data.user.repositories.totalCount != 0)
					{
						object = {"data":resp.data.user.login + (resp.data.user.name != null && resp.data.user.name != '' ? ('/' + resp.data.user.name) : ''),"value":resp.data.user.repositories.totalCount};
						allUserRepositoriesArray.push(object);
					}
					//watching
					if (resp.data.user.watching.totalCount != 0)
					{
						object = {"data":resp.data.user.login + (resp.data.user.name != null && resp.data.user.name != '' ? ('/' + resp.data.user.name) : ''),"value":resp.data.user.watching.totalCount};
						allUserWatchingArray.push(object);
					}
				},
				error:function(e){
					console.log("get watch error");
				}
		});
		searchResultArray.push({"name": response.data.search.edges[i].node.login + '/' + response.data.search.edges[i].node.name, "location": response.data.search.edges[i].node.location, "url": response.data.search.edges[i].node.url, "bio": response.data.search.edges[i].node.bio});
		userPromises.push(userPromise);
	}
	Promise.all(userPromises).then(function(){
		// 畫大圖
		drawPie(convertToD3Data(allUserStarArray), '#bigChart' , 400, 400, '#color-legend-area');
		changeBtndiv(1);
	})
}

//輸出"issue"搜尋結果
function printIssueResult(response,Length){
	var title;
	// console.log(response);
	//總共有幾個page
	for(var i = 0;i < response.data.search.edges.length;i++){
		title = response.data.search.edges[i].node.title;
		// console.log(response.data.search.edges[i].node);
		if (Object.keys(response.data.search.edges[i].node).length == 0){
			console.log("empty");
		}
		else{
			//participant
			object = {"data":title,"value":response.data.search.edges[i].node.participants.totalCount};
			allIssueParticipantArray.push(object);
			//label
			object = {"data":title,"value":response.data.search.edges[i].node.labels.totalCount};
			allIssueLabelArray.push(object);
			//comment
			object = {"data":title,"value":response.data.search.edges[i].node.comments.totalCount};
			allIssueCommentArray.push(object);

			searchResultArray.push(response.data.search.edges[i].node);
		}
		
	}
	// console.log(allIssueParticipantArray);
}

// function changeToLanguage(){
// 	drawPie(convertToD3Data(allRepositoryLanguageArray), '#bigChart' , 400, 400, '#color-legend-area')
// };
// function changeToFork(){
// 	drawPie(convertToD3Data(allRepositoryForkArray), '#bigChart' , 400, 400, '#color-legend-area')
// };
// function changeToStar(){
// 	drawPie(convertToD3Data(allRepositoryStarArray), '#bigChart' , 400, 400, '#color-legend-area')
// };
// function changeToWatch(){
// 	drawPie(convertToD3Data(allRepositoryWatchArray), '#bigChart' , 400, 400, '#color-legend-area')
// };
// function changeToPullRequest(){
// 	drawPie(convertToD3Data(allRepositoryPullRequestArray), '#bigChart' , 400, 400, '#color-legend-area')
// };
// function changeToIssue(){
// 	drawPie(convertToD3Data(allRepositoryIssueArray), '#bigChart' , 400, 400, '#color-legend-area')
// };

function changeToLanguage(){
	drawPie(convertToD3Data(allRepositoryLanguageArray), '#bigChart' , 400, 400, '#color-legend-area')
};
function changeToFork(){
	drawPie(convertToD3Data(allRepositoryForkArray), '#bigChart' , 400, 400, '#color-legend-area')
};
function changeToRepoStar(){
	drawPie(convertToD3Data(allRepositoryStarArray), '#bigChart' , 400, 400, '#color-legend-area')
};
function changeToUserStar(){
	drawPie(convertToD3Data(allUserStarArray), '#bigChart' , 400, 400, '#color-legend-area')
};
function changeToWatch(){
	drawPie(convertToD3Data(allRepositoryWatchArray), '#bigChart' , 400, 400, '#color-legend-area')
};
function changeToWatching(){
	drawPie(convertToD3Data(allUserWatchingArray), '#bigChart' , 400, 400, '#color-legend-area')
};
function changeToFollowing(){
	drawPie(convertToD3Data(allUserFollowingArray), '#bigChart' , 400, 400, '#color-legend-area')
};
function changeToFollowers(){
	drawPie(convertToD3Data(allUserFollowersArray), '#bigChart' , 400, 400, '#color-legend-area')
};
function changeToRepoPullRequest(){
	drawPie(convertToD3Data(allRepositoryPullRequestArray), '#bigChart' , 400, 400, '#color-legend-area')
};
function changeToUserPullRequest(){
	drawPie(convertToD3Data(allUserPullRequestArray), '#bigChart' , 400, 400, '#color-legend-area')
};
function changeToRepoIssue(){
	drawPie(convertToD3Data(allRepositoryPullRequestArray), '#bigChart' , 400, 400,'#color-legend-area')
};
function changeToUserIssue(){
	drawPie(convertToD3Data(allUserIssueArray), '#bigChart' , 400, 400,'#color-legend-area')
};
function changeToRepo(){
	drawPie(convertToD3Data(allUserRepositoriesArray), '#bigChart' , 400, 400, '#color-legend-area')
};
function changeToParticipant(){
	drawPie(convertToD3Data(allIssueParticipantArray), '#bigChart' , 400, 400,'#color-legend-area')
};
function changeToLabel(){
	drawPie(convertToD3Data(allIssueLabelArray), '#bigChart' , 400, 400,'#color-legend-area')
};
function changeToComment(){
	drawPie(convertToD3Data(allIssueCommentArray), '#bigChart' , 400, 400, '#color-legend-area')
};

function changeType(input)
{
	if(input=="users")
		$("#date").hide();
	else
		$("#date").show();
}

layui.use(['laypage', 'layer'], function(){
	var laypage = layui.laypage
	,layer = layui.layer;
	var data;
	data = searchResultArray
	 
  // var data = [
  //   {title:'1', description:'121'},
  //   {title:'2', description:'122'},
  //   {title:'3', description:'123'},
  //   {title:'4', description:'124'},
  //   {title:'5', description:'125'},
  //   {title:'6', description:'126'},
  //   {title:'7', description:'127'},
  //   {title:'8', description:'128'},
  //   {title:'9', description:'129'},
  //   {title:'10', description:'1210'},
  //   {title:'11', description:'1211'},
  //   {title:'12', description:'1212'},
  //   {title:'13', description:'1213'},
  //   {title:'14', description:'1214'},
  //   {title:'15', description:'1215'},
  //   {title:'16', description:'1216'},
  // ];  

	laypage.render({
	    elem: 'paging'
	    ,count: data.length
	    ,jump: function(obj){
    	// console.log(obj);
    	//模拟渲染
    		var thisData = [];
	  
			document.getElementById('pageResult').innerHTML = function(){
		        var arr = [];
		        thisData = data.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
				switch(pType)
				{
					case 'REPOSITORY': 
				        layui.each(thisData, function(index, item){
				        	var pushObj = '<div class="w3-row" style="border-bottom:5px black solid;padding:15px;">'
											+'<div class="w3-col" style="width:60%;height:175px">'
												+'<a href="' + item.url + '" target="_blank">'
												+'<h2 id="title_'+index+'" class="ellipsis projectName">'+item.title+'</h2><br>'
												+'<p class="ellipsis2">'+ (item.description != null ? item.description : '') +'</p><br>'
												+'</a>';
							for (var i = 0; i < item.topic.length; i++)
							{
								pushObj += '<span class="topicCss">'+item.topic[i].node.topic.name +'</span>'+ ' ';
							}

							pushObj += '</div>'
										+'<div class="w3-col" style="width:5%;height:175px"></div>'
										+'<div class="w3-col" style="width:30%;height:175px">'
											+'<a href="analysis.html?name=' + item.title + '">'
											+'<div id="smallChart-' + index + '"></div>'
											+'</a>'					
										+'</div>'	
									+'</div>';
				            arr.push(pushObj);
			        	});
						break;
					case 'USER':
				        layui.each(thisData, function(index, item){
				        	var pushObj = '<div class="w3-row" style="border-bottom:5px black solid;padding:15px;">'
											+'<div class="w3-col" style="width:60%;height:175px">'
												+'<a href="' + item.url + '" target="_blank">'
												+'<h2 id="title_'+index+'" class="ellipsis projectName">'+item.name+'</h2><br>'
												+'<p class="ellipsis2">'+ (item.bio != null ? item.bio : '') +'</p><br>'
												+'<p>' + item.location + '</p>'
												+'</a>'
											+ '</div>'
											+'<div class="w3-col" style="width:5%;height:175px"></div>'
											+'<div class="w3-col" style="width:30%;height:175px">'
												+'<a href="analysis.html?name=' + item.title + '">'
												+'<div id="smallChart-' + index + '"></div>'
												+'</a>'					
											+'</div>'	
										+'</div>';
				            arr.push(pushObj);
			        	});
						break;
					case 'ISSUE':
				        layui.each(thisData, function(index, item){
				        	var pushObj = '<div class="w3-row" style="border-bottom:5px black solid;padding:15px;">'
											+'<div class="w3-col" style="width:60%;height:175px">'
												+'<a href="' + item.url + '" target="_blank">'
												+'<h2 id="title_'+index+'" class="ellipsis projectName">'+item.title+'</h2><br>'
												+'<p class="ellipsis2">'+ item.body +'</p><br>'
												+'<p>' + item.updatedAt + '</p>'
												+'</a>'
											+ '</div>'
											+'<div class="w3-col" style="width:5%;height:175px"></div>'
											+'<div class="w3-col" style="width:30%;height:175px">'
											+'</div>'	
										+'</div>';
				            arr.push(pushObj);
			        	});
						break;
				}
       			return arr.join('');
	    	}();

		    layui.each(thisData, function(index, item){
		  		if (item.language != null)
					drawSmallPie(item.language, '#smallChart-' + index, 175, 175);
					// console.log('abc')
				// console.log(index);
		    });
		  	window.scrollTo(0,0);
		}
	});
});

function changeBtndiv(i){
    var data = ['<button class="btn btn-primary" onclick="changeToLanguage()">language</button><button class="btn btn-success" onclick="changeToFork()">fork</button><button class="btn btn-primary" onclick="changeToRepoStar()">star</button><button class="btn btn-info" onclick="changeToWatch()">watch</button><button class="btn btn-success" onclick="changeToRepoPullRequest()">pull request</button><button class="btn btn-info" onclick="changeToRepoIssue()">issue</button>',
    '<button class="btn btn-primary" onclick="changeToUserIssue()">Issue</button><button class="btn btn-success" onclick="changeToFollowers()">Followers</button><button class="btn btn-primary" onclick="changeToFollowing()">following</button><button class="btn btn-success" onclick="changeToRepo()">Repositories</button><button class="btn btn-info" onclick="changeToUserPullRequest()">PullRequest</button><button class="btn btn-primary" onclick="changeToUserStar()">Star</button><button class="btn btn-success" onclick="changeToWatching()">Watching</button>',
    '<button class="btn btn-primary" onclick="changeToParticipant()">Participant</button><button class="btn btn-success" onclick="changeToLabel()">Label</button><button class="btn btn-primary" onclick="changeToComment()">Comment</button>'];
    changeBtn = document.getElementById('Btndiv');
    changeBtn.innerHTML = data[i];
 }