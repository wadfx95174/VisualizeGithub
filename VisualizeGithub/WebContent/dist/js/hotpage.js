var ajaxURL="http://localhost:8080/";
$(document).ready(function(){
	$.ajax({
		url:ajaxURL+"VisualizeGithub/LeaderboardServlet.do",
		method : 'POST',
		cache :false,
		data:{
			action:'starinWeek'
		},
		success:function(response){
			console.log(response);
			$("#starContent").append('<div>'
							+'<a href="">'
							+'<div class="w3-col" style="width:60%;border-top:5px black solid;padding:15px;">'
								+'<h5 style="padding:0 0 0 50px;">xxx</h5>'
							+'</div>'
							+'<div class="w3-col" style="width:40%;border-top:5px black solid;padding:15px;">'
								+'<h5 style="padding:0 0 0 50px;">100000000</h5>'						
							+'</div>'
							+'</a>'
						+'</div>');
		}
	});
})