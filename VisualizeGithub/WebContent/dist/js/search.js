
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
		if($("#language").val()!="")language = "language:"+$("#language").val();
		//設定時間限制
		if($("#date").val()!="")pushed = "pushed:>"+Year+"-"+Mon+"-"+Day;
		// console.log(apiSearchUrl+$("#type").val()+"?q="+$("#searchText").val()+language+pushed+"&sort=stars&order=desc&per_page=100&"+access_token);

		var check=true,cursor="";
		//repository
		if($("#type").val() == "REPOSITORY"){
			//跑搜尋結果。一個query只能抓100個edge，所以要用迴圈，然後每次都抓該組的pageInfo中的hasNextPage，去判斷
			//如果hasNextPage是true，就要把endCursor放在after中
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
							  +'search(query: "'+$("#searchText").val()+' '+language+' '+pushed+' sort:stars-desc", type: REPOSITORY, first: 100'+cursor+') {'
							    +'edges {'
							      +'node {'
							        +'... on Repository {'
							          +'owner{'
							            +'login'
							          +'}'
							          +'name '
							          +'description '
							          +'stargazers {'
							            +'totalCount'
							          +'}'
							          +'forks {'
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
						// console.log(response)
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
		else if($("#type").val() == "USER"){
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
							  +'search(query: "'+$("#searchText").val()+' '+language+'", type: USER, first: 100'+cursor+') {'
							    +'edges {'
							      +'node {'
							        +'... on User {'
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
		else {
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
							  +'search(query: "'+$("#searchText").val()+' '+language+' '+pushed+', type: USER, first: 100'+cursor+') {'
							    +'edges {'
							      +'node {'
							        +'... on Issue {'
							          +'owner{'
							            +'login'
							          +'}'
							          +'name '
							          +'description '
							          +'stargazers {'
							            +'totalCount'
							          +'}'
							          +'forks {'
							            +'totalCount'
							          +'}'
							          +'updatedAt'
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

						printResult(response,response.data.search.edges.length);
					},
					error:function(e){
						console.log("search error");
					}
				});
			}
		}
	});
})


//languageArray各個搜尋結果的小圖
var languageArray=[];
//大圖要的資料，repository
var allRepositoryLanguageArray=[],allRepositoryForkArray=[],allRepositoryStarArray=[];
var allRepositoryWatchArray=[],allRepositoryPullRequestArray=[];
//大圖要的資料，user
var allUserIssueArray=[],allUserFollowersArray=[],allUserFollowingArray=[],allUserRepositoriesArray=[];
var allUserPullRequestArray=[],allUserStarArray=[],allUserWatchingArray=[];

var languageObject,object;

//輸出"repository"搜尋結果
function printRepositoryResult(response,length){
	var name,login;
	
	//總共有幾個page
	for(var i = 0;i < length;i++){
		name = response.data.search.edges[i].node.name;
		login = response.data.search.edges[i].node.owner.login;
		//拿該專案有用到的所有language
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
				  +'repository(owner:"'+login+'",name:"'+name+'"){'
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
				// console.log(resp.data.repository.languages.edges)
				languageArray = [];
				for(var j = 0;j < resp.data.repository.languages.edges.length;j++){
					languageObject = {"data":resp.data.repository.languages.edges[j].node.name
					,"value":resp.data.repository.languages.edges[j].size};
					languageArray.push(languageObject);
				}
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
				},
				error:function(e){
					console.log("get watch error");
				}
		});
	}
}
//輸出"user"搜尋結果
function printUserResult(response,length){
	var login;
	//總共有幾個page
	for(var i = 0;i < length;i++){
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
function printIssueResult(response,Length){

}