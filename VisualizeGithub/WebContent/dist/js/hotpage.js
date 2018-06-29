var ajaxURL="https://visualizegithub.herokuapp.com/";

var chartData = [{'data': '50000以上', 'value': 0}, {'data': '40000 ~ 49999', 'value': 0}, {'data': '30000 ~ 39999', 'value': 0}, {'data': '20000 ~ 29999', 'value': 0}, {'data': '10000 ~ 19999', 'value': 0}, {'data': '10000以下', 'value': 0}];

var intervals = [50000, 40000, 30000, 20000, 10000];

var starWeek = [];
var starMonth = [];
var starHalfYear = [];
var starYear = [];
var forkWeek = [];
var forkMonth = [];
var forkHalfYear = [];
var forkYear = [];
var follow = [];


var currentData;
var selectedTime;

$(document).ready(function(){
	// 取 week star
	$.ajax({
		url:ajaxURL+"LeaderboardServlet.do",
		method : 'POST',
		cache :false,
		data:{
			action:'starinWeek'
		},
		success:function(response){
			console.log('week');
//			console.log(response);
//			weekStar = response;
			for (var i = 0; i < response.length; i++)
			{
				starWeek.push({fullName: response[i].fullName, count: response[i].stargazersCount, url: response[i].url});
			}
			// 初始化為 Pie Chart 資料為 WeekStar
			setDataToPage('#starContent', starWeek);
			changeToPieChart('#star-chart', '#star-color');
		}
	});

	// 取 month star
	$.ajax({
		url:ajaxURL+"LeaderboardServlet.do",
		method : 'POST',
		cache :false,
		data:{
			action:'starinMonth'
		},
		success:function(response){
			console.log(response); 
			for (var i = 0; i < response.length; i++)
			{
				starMonth.push({fullName: response[i].fullName, count: response[i].stargazersCount, url: response[i].url});
			}
		}
	});

	// 取 halfyear star
	$.ajax({
		url:ajaxURL+"LeaderboardServlet.do",
		method : 'POST',
		cache :false,
		data:{
			action:'starinHalfYear'
		},
		success:function(response){
			console.log(response); 
			for (var i = 0; i < response.length; i++)
			{
				starHalfYear.push({fullName: response[i].fullName, count: response[i].stargazersCount, url: response[i].url});
			}
		}
	});

	// 取 year star
	$.ajax({
		url:ajaxURL+"LeaderboardServlet.do",
		method : 'POST',
		cache :false,
		data:{
			action:'starinYear'
		},
		success:function(response){
			console.log(response); 
			for (var i = 0; i < response.length; i++)
			{
				starYear.push({fullName: response[i].fullName, count: response[i].stargazersCount, url: response[i].url});
			}
		}
	});

	// 取 week fork
	$.ajax({
		url:ajaxURL+"LeaderboardServlet.do",
		method : 'POST',
		cache :false,
		data:{
			action:'forkinWeek'
		},
		success:function(response){
			console.log(response); 
			for (var i = 0; i < response.length; i++)
			{
				forkWeek.push({fullName: response[i].fullName, count: response[i].forksCount, url: response[i].url});
			}
			setDataToPage('#forkContent', forkWeek);
			changeToPieChart('#fork-chart', '#fork-color');
		}
	});

	// 取 month fork
	$.ajax({
		url:ajaxURL+"LeaderboardServlet.do",
		method : 'POST',
		cache :false,
		data:{
			action:'forkinMonth'
		},
		success:function(response){
			console.log(response); 
			for (var i = 0; i < response.length; i++)
			{
				forkMonth.push({fullName: response[i].fullName, count: response[i].forksCount, url: response[i].url});
			}
		}
	});

	// 取  halfyear fork
	$.ajax({
		url:ajaxURL+"LeaderboardServlet.do",
		method : 'POST',
		cache :false,
		data:{
			action:'forkinHalfYear'
		},
		success:function(response){
			console.log(response); 
			for (var i = 0; i < response.length; i++)
			{
				forkHalfYear.push({fullName: response[i].fullName, count: response[i].forksCount, url: response[i].url});
			}
		}
	});

	// 取 year fork
	$.ajax({
		url:ajaxURL+"LeaderboardServlet.do",
		method : 'POST',
		cache :false,
		data:{
			action:'forkinYear'
		},
		success:function(response){
			console.log(response); 
			for (var i = 0; i < response.length; i++)
			{
				forkYear.push({fullName: response[i].fullName, count: response[i].forksCount, url: response[i].url});
			}
		}
	});
	
	// 取 follow
	$.ajax({
		url:ajaxURL+"LeaderboardServlet.do",
		method : 'POST',
		cache :false,
		data:{
			action:'follow'
		},
		success:function(response){
			console.log(response); 
			for (var i = 0; i < response.length; i++)
			{
				follow.push({fullName: response[i].login, count: response[i].forksCount, url: response[i].url});
			}
			setDataToPage('#followContent', follow);
			changeToPieChart('#follow-chart', '#follow-color');
		}
	});
})

// 設置畫面
function setDataToPage(area, data)
{
	$(area).html('');
	for (var i = 0; i < 10; i++)
	{
		$(area).append('<div>'
						+'<a href="' + data[i].url + '">'
						+'<div class="w3-col" style="width:60%;border-top:5px black solid;padding:15px;">'
							+'<h5 style="padding:0 0 0 50px;">' + data[i].fullName + '</h5>'
						+'</div>'
						+'<div class="w3-col" style="width:40%;border-top:5px black solid;padding:15px;">'
							+'<h5 style="padding:0 0 0 50px;">' + data[i].count + '</h5>'						
						+'</div>'
						+'</a>'
					+'</div>');
	}
	
	// 初始化 ChartData 陣列
	for (var i = 0; i < chartData.length; i++)
	{
		chartData[i].value = 0;
	}

	// 取 value 區間 10000 以上
	var valIndex = 0;
	var count;
	for (count = 0; count < data.length && valIndex < intervals.length; count++) 
	{
		if (data[count].count > intervals[valIndex])
			chartData[valIndex].value += 1;
		else 
			chartData[++valIndex].value += 1;
	}
	// 剩下的 10000 以下
	if (valIndex == intervals.length)
		chartData[valIndex].value = data.length - count;
}

$('#star-date').change(function(){
	console.log('change');
	console.log($(this).val());
	switch($(this).val())
	{
	case '7':
		setDataToPage('#starContent', starWeek);
		break;
	case '30':
		setDataToPage('#starContent', starMonth);
		break;
	case '180':
		setDataToPage('#forkContent', starHalfYear);
		break;
	case '365':
		setDataToPage('#starContent', starYear);
		break;
	}
	changeToPieChart('#star-chart', '#star-color');
})

$('#fork-date').change(function(){
	console.log('change');
	console.log($(this).val());
	switch($(this).val())
	{
	case '7':
		setDataToPage('#forkContent', forkWeek);
		break;
	case '30':
		setDataToPage('#forkContent', forkMonth);
		break;
	case '180':
		setDataToPage('#forkContent', forkHalfYear);
		break;
	case '365':
		setDataToPage('#forkContent', forkYear);
		break;
	}
	changeToPieChart('#fork-chart', '#fork-color');
})


function changeToPieChart(chartArea, colorArea)
{
	drawPie(chartData, chartArea, 500, 500, colorArea);
}

function changeToBarChart(chartArea)
{
	drawBar(chartData, chartArea, 500, 500);
}