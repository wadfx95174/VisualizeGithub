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
		
		if($("#language").val()!="")language = "+language:"+$("#language").val();
		if($("#date").val()!="")pushed = "+pushed:>"+Year+"-"+Mon+"-"+Day;
		console.log(apiUrl+$("#type").val()+"?q="+$("#searchForm").val()+language+pushed+"&sort=stars&order=desc");
		$.ajax({
			url:apiUrl+$("#type").val()+"?q="+$("#searchForm").val()+language+pushed+"&sort=stars&order=desc",
			cache:false,
			success:function(result){
				console.log(result);
			},
			error:function(e){
				console.log("search-error");
			}
		});
	});
});