var apiUrl = "https://api.github.com/search/";

var language,pushed;
$(document).ready(function(){
	language="";
	pushed="";
	//append select的option
	//搜尋按鈕
	$("#searchButton").click(function(){
		console.log("lll");
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
//		console.log(apiUrl+$("#type").val()+"?q="+$("#searchText").val()+language+pushed+"&sort=stars&order=desc");
		$.ajax({
			url:apiUrl+$("#type").val()+"?q="+$("#searchText").val()+language+pushed+"&sort=stars&order=desc",
			cache:false,
			success:function(response){
				console.log(response);
			},
			error:function(e){
				console.log("search-error");
			}
		});
	});
	var img;
	//star排行榜
	$.ajax({
		url:"https://api.github.com/search/repositories?q=stars:>100000&sort=stars&order=desc",
		cache:false,
		success:function(response){
			console.log(response.total_count)
			for(var i = 0;i < 3;i++){
				if(i==0)img = '<img class="rotate" src="img/icon/銀牌.jpg" alt="Generic placeholder image" style="width:160px;height:160px">';
				else if(i==1)img = '<img class="rotate" src="img/icon/金牌.jpg" alt="Generic placeholder image" style="width:200px;height:200px">';
				else img = '<img class="rotate" src="img/icon/銅牌.jpg" alt="Generic placeholder image" style="width:120px;height:120px">';
				console.log(response.items[i].full_name);
				console.log(response.items[i].description);
				$("#starLeaderboard").append('<div class="col-sm-4 wow fadeInDown text-center">'
						+img
						+'<h3>'+response.items[i].full_name+'</h3>'
						+'<p class="lead">'+response.items[i].description+'</p>'
						+'<p><a href="https://github.com/'+response.items[i].full_name+'" class="btn btn-embossed btn-primary view" role="button" style="margin-right:10px;">分析</a>'
						+'<a href="https://github.com/'+response.items[i].full_name+'" class="btn btn-embossed btn-primary view" role="button">連結</a></p>'
						+'</div>');
			}
		},
		error:function(e){
			console.log("trending init error");
		}
	});
	//fork排行榜
	$.ajax({
		url:"https://api.github.com/search/repositories?q=forks:>30000&sort=forks&order=desc",
		cache:false,
		success:function(response){
			for(var i = 0;i < 3;i++){
				if(i==0)img = '<img class="rotate" src="img/icon/銀牌.jpg" alt="Generic placeholder image" style="width:160px;height:160px">';
				else if(i==1)img = '<img class="rotate" src="img/icon/金牌.jpg" alt="Generic placeholder image" style="width:200px;height:200px">';
				else img = '<img class="rotate" src="img/icon/銅牌.jpg" alt="Generic placeholder image" style="width:120px;height:120px">';
				console.log(response.items[i].full_name);
				console.log(response.items[i].description);
				$("#forkLeaderboard").append('<div class="col-sm-4 wow fadeInDown text-center">'
						+img
						+'<h3>'+response.items[i].full_name+'</h3>'
						+'<p class="lead">'+response.items[i].description+'</p>'
						+'<p><a href="https://github.com/'+response.items[i].full_name+'" class="btn btn-embossed btn-primary view" role="button" style="margin-right:10px;">分析</a>'
						+'<a href="https://github.com/'+response.items[i].full_name+'" class="btn btn-embossed btn-primary view" role="button">連結</a></p>'
						+'</div>');
			}
		},
		error:function(e){
			console.log("trending init error");
		}
	});
});