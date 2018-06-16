var apiUrl = "https://api.github.com/search/";

var language,pushed;
$(document).ready(function(){
	
	language="";
	pushed="";
	//append select的option
	appendOption();
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
		if($("#language").val()!="")language = "+language:"+$("#language").val();
		if($("#date").val()!="")pushed = "+pushed:>"+Year+"-"+Mon+"-"+Day;
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

function appendOption(){
	$("#type").append('<option selected value="repositories">專案名稱</option>'
			+'<option value="code">程式碼</option>'
			+'<option value="commits">提交</option>'
			+'<option value="issues">議題</option>'
			+'<option value="users">使用者</option>'
			+'<option value="topics">主題</option>');
	
	$("#language").append('<option selected value="">不限語言</option>'
	           +'<option value="java">Java</option>'
	           +'<option value="C%2B%2B">C++</option>'
	           +'<option value="python">Python</option>'
	           +'<option>自訂語言</option>');
	
	$("#date").append('<option selected value="">不限日期</option>'
			+'<option value="1">一天內</option>'
            +'<option value="7">一週內</option>'
            +'<option value="30">一個月內</option>'
            +'<option value="180">半年內</option>'
            +'<option value="365">一年內</option>'
            +'<option>自訂日期範圍</option>');
}