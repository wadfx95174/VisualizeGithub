
// $(document).ready(function(){
// 	var check=true,cursor="",created;

// 	var date = new Date();
// 	var Year = date.getFullYear()
// 	var Mon = date.getMonth() + 1
// 	var Day = date.getDate();
// 	if(Mon < 10)Mon = "0"+Mon;
// 	//算時間，一年以上(包含)
// 	if($("#date").val()>=365){
// 		Year -= ($("#date").val()/365);
// 	}
// 	//一個月以上(包含)，一年以下
// 	if(($("#date").val()%365)>=30 && ($("#date").val()%365)<365){
// 		Mon -= Math.floor((($("#date").val()%365)/30));
// 		if(Mon <= 0){
// 			Mon = 12+Mon;
// 			Year -= 1;
// 		}
// 		if(Mon<10){
// 			Mon = "0"+Mon;
// 		}
// 	}
// 	//一個月以內
// 	if((($("#date").val()%365)%30)<30 && (($("#date").val()%365)%30)>0){
// 		Day -=(($("#date").val()%365)%30);	
// 		if(Day<10)Day = "0"+Day;
// 	}

// 	if($("#date").val()!=""){
// 		created = "created:>"+Year+"-"+Mon+"-"+Day;
// 	}

// 	while(check){
// 		$.ajax({
// 			method: "POST",
// 	    	url: "https://api.github.com/graphql",
// 	    	contentType: "application/json",
// 	    	cache:false,
// 			//取消非同步
// 			async:false,
// 	      	headers: {
// 	        	Authorization: "bearer 727d34d1872545e5859ec1c969dea1f93a20d253"
// 	      	},
// 	      	data: JSON.stringify({
// 	      		query:
// 	      		'{'
// 				  +'search(query: "created:>2018-06-01", type: REPOSITORY, first: 100'+cursor+') {'
// 				  +'repositoryCount '
// 				    +'edges {'
// 				      +'node { '
// 				        +'... on Repository {'
// 				          +'languages(first: 20) {'
// 				            +'edges {'
// 				              +'node {'
// 				                +'name'
// 				              +'}'
// 				              +'size'
// 				            +'}'
// 				          +'}'
// 				        +'}'
// 				      +'}'
// 				    +'}'
// 				    +'pageInfo {'
// 				      +'hasNextPage '
// 				      +'endCursor'
// 				    +'}'
// 				  +'}'
// 				+'}'
// 			}),
// 			success:function(response){
// 				console.log(response);
// 				check = response.data.search.pageInfo.hasNextPage;
// 				cursor = ',after:"'+response.data.search.pageInfo.endCursor+'"';
// 			},
// 			error:function(e){
// 				console.log("star trending init error");
// 			}
// 		});
// 	}
	
// })