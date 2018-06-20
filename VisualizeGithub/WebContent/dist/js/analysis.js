

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
		url:"https://api.github.com/repos/"+fullName+"/commits?page="+i+"&per_page=100&access_token=141e5228f30dc778302457c79b0a58d4a66d246e",
		cache:false,
		success:function(response){
			if(response.length!=0){
				for(var j = 0;j < response.length;j++){
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
	
	

});
