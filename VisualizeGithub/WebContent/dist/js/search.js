
var language,pushed,created;


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


	var pType = get('type');
	var pL = get('l');
	var pDate = get('date');
	var pText = get('text');
	



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
	if(pDate!=""){
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
		        	Authorization: "bearer 727d34d1872545e5859ec1c969dea1f93a20d253"
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
		        	Authorization: "bearer 727d34d1872545e5859ec1c969dea1f93a20d253"
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
					console.log(response)
					check = response.data.search.pageInfo.hasNextPage;
					cursor = ',after:"'+response.data.search.pageInfo.endCursor+'"';

					printUserResult(response,response.data.search.edges.length);
				},
				error:function(e){
					console.log("search user error");
				}
			});
		}
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
		        	Authorization: "bearer 727d34d1872545e5859ec1c969dea1f93a20d253"
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
						          +'title'
						          +'updatedAt'
						          +'body'
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

var searchResultArray = [];
var eachLangArray = new Map();

//輸出"repository"搜尋結果
function printRepositoryResult(response,length){
	var name,login;
	console.log(response);
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
	        	Authorization: "bearer 727d34d1872545e5859ec1c969dea1f93a20d253"
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
				console.log('name: ' + resp.data.repository.name + '  lang: ' + resp.data.repository.languages.edges);

				// console.log()
				languageArray = [];
				for(var j = 0;j < resp.data.repository.languages.edges.length;j++){
					languageObject = {"repository":resp.data.repository.name
					,"data":resp.data.repository.languages.edges[j].node.name
					,"value":resp.data.repository.languages.edges[j].size};
					languageArray.push(languageObject);
				}
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
	        	Authorization: "bearer 727d34d1872545e5859ec1c969dea1f93a20d253"
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
		promises.push(langPromise);
		promises.push(resultPromise);
		searchResultArray.push({title: login + '/' + name, description: response.data.search.edges[i].node.description, url: response.data.search.edges[i].node.url, topic: response.data.search.edges[i].node.repositoryTopics.edges});
	};
	Promise.all(promises).then(function(){
		console.log(searchResultArray);
		console.log(eachLangArray);

		console.log(searchResultArray);

		drawPie(convertToD3Data(allRepositoryStarArray), '#bigChart' , 400, 400);
		for (var i = 0; i < searchResultArray.length; i++)
		{
			searchResultArray[i].language = eachLangArray.get(searchResultArray[i].title.split('/')[1]);
		}
		for (var i = 0; i < 10; i++)
		{
		    drawPie(searchResultArray[i].language, '#smallChart-' + i, 150, 150);
		}
	})
}
//輸出"user"搜尋結果
function printUserResult(response,length){
	var login;
	//總共有幾個page
	for(var i = 0;i < 30;i++){
		login = response.data.search.edges[i].node.login;
		//拿所有搜尋結果的不同資料的數量，然後塞入陣列
		$.ajax({
			method: "POST",
	    	url: "https://api.github.com/graphql",
	    	contentType: "application/json",
	      	headers: {
	        	Authorization: "bearer 727d34d1872545e5859ec1c969dea1f93a20d253"
	      	},
	      	data: JSON.stringify({
	      		query:
	      		'query{'
					  +'user(login:"'+login+'"){'
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
					console.log(resp);
					//pullrequest
					object = {"data":resp.data.user.name,"value":resp.data.user.pullRequests.totalCount};
					allUserPullRequestArray.push(object);
					//issue
					object = {"data":resp.data.user.name,"value":resp.data.user.issues.totalCount};
					allUserIssueArray.push(object);
					//followers
					object = {"data":resp.data.user.name,"value":resp.data.user.followers.totalCount};
					allUserFollowersArray.push(object);
					//following
					object = {"data":resp.data.user.name,"value":resp.data.user.following.totalCount};
					allUserFollowingArray.push(object);
					//star
					object = {"data":resp.data.user.name,"value":resp.data.user.starredRepositories.totalCount};
					allUserStarArray.push(object);
					//repositories
					object = {"data":resp.data.user.name,"value":resp.data.user.repositories.totalCount};
					allUserRepositoriesArray.push(object);
					//watching
					object = {"data":resp.data.user.name,"value":resp.data.user.watching.totalCount};
					allUserWatchingArray.push(object);
				},
				error:function(e){
					console.log("get watch error");
				}
		});
	}
}

//輸出"issue"搜尋結果
function printIssueResult(response,Length){
	var title;
	//總共有幾個page
	for(var i = 0;i < length;i++){
		title = response.data.search.edges[i].node.title;

		//participant
		object = {"data":title,"value":response.data.search.edges[i].node.participants.totalCount};
		allIssueParticipantArray.push(object);
		//label
		object = {"data":title,"value":response.data.search.edges[i].node.labels.totalCount};
		allIssueLabelArray.push(object);
		//comment
		object = {"data":title,"value":response.data.search.edges[i].node.comments.totalCount};
		allIssueCommentArray.push(object);
	}
}

function changeToLanguage(){
	drawPie(convertToD3Data(allRepositoryLanguageArray), '#bigChart' , 400, 400)
};
function changeToFork(){
	drawPie(convertToD3Data(allRepositoryForkArray), '#bigChart' , 400, 400)
};
function changeToStar(){
	drawPie(convertToD3Data(allRepositoryStarArray), '#bigChart' , 400, 400)
};
function changeToWatch(){
	drawPie(convertToD3Data(allRepositoryWatchArray), '#bigChart' , 400, 400)
};
function changeToPullRequest(){
	drawPie(convertToD3Data(allRepositoryPullRequestArray), '#bigChart' , 400, 400)
};
// function changeToIssue(){
// 	drawPie(convertToD3Data(allRepositoryPullRequestArray), '#bigChart' , 400, 400)
// };