

function get(name)
{
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}
$(document).ready(function(){
	var fullName = get('name');
	//存放該repository的commit資料
	var commitArray=[];
	var object;

	//抓commit資料
	//因為不知道有幾頁，就全部跑，用length來判斷該頁面有沒有東西，如果沒有就不做事
	for(var i = 1 ;i <= 10; i++){
		$.ajax({
			url:"https://api.github.com/repos/"+fullName+"/commits?page="+i+"&per_page=100&access_token=727d34d1872545e5859ec1c969dea1f93a20d253",
			cache:false,
			success:function(response){
				if(response.length!=0){
					// console.log(response);
					for(var j = 0;j < response.length;j++){
						// console.log(response[j].committer.login);
						object={"committer":response[j].committer.login,"message":response[j].commit.message,
							"date":response[j].commit.committer.date};
						commitArray.push(object);
					}
				}
				// console.log(commitArray);
			},
			error:function(e){
				console.log("analysis error");
			}
		});
	}

	
	var check=true,cursor="";
	//release
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
					  +'repository(owner: "'+fullName.split("/")[0]+'", name: "'+fullName.split("/")[1]+'") {'
					    +'releases(first:100'+cursor+'){'
					      +'edges{'
					        +'node{'
					          +'author{'
					            +'login'
					          +'}'
					          +'description '
					          +'url '
					          +'updatedAt '
					          +'tag {'
					            +'name '
					          +'}'
					        +'}'
					      +'}'
					      +'pageInfo{'
					        +'endCursor '
					        +'hasNextPage'
					      +'}'
					    +'}'
					  +'}'
					+'}'
			}),
			success:function(response){
				console.log(response)
				// console.log(response.data.search.pageInfo.hasNextPage)
				check = response.data.repository.releases.pageInfo.hasNextPage;
				cursor = ',after:"'+response.data.repository.releases.pageInfo.endCursor+'"';

				printRelease(response,response.data.repository.releases.edges.length);
			},
			error:function(e){
				console.log("release error");
			}
		});
	}
	

	var languageArray=[];
	//language
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
				  +'repository(owner:"'+fullName.split("/")[0]+'",name:"'+fullName.split("/")[1]+'"){'
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
				// console.log(resp);
				// console.log('name: ' + resp.data.repository.name + '  lang: ' + resp.data.repository.languages.edges);

				for(var j = 0;j < resp.data.repository.languages.edges.length;j++){
					object = {"data":resp.data.repository.languages.edges[j].node.name
					,"value":resp.data.repository.languages.edges[j].size};
					languageArray.push(object);
				}
				// console.log(languageArray);
			},
			error:function(e){
				console.log("get language error");
			}
		});


});
//這個陣列要"顛倒"讀值，因為越舊的版本在越前面
var releaseArray=[];
function printRelease(response,length){
	for(var i = 0;i < length;i++){
		object={"author":response.data.repository.releases.edges[i].node.author.login,
				"description":response.data.repository.releases.edges[i].node.description,
				"url":response.data.repository.releases.edges[i].node.url,
				"updatedAt":response.data.repository.releases.edges[i].node.updatedAt,
				"releaseName":response.data.repository.releases.edges[i].node.tag.name};
		releaseArray.push(object);
	}
	console.log(releaseArray);
}