

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
						console.log(response[j].committer.login);
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

			},
			error:function(e){
				console.log("release error");
			}
		});
	}
	
});