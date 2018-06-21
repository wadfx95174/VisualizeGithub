
var container ;

var source ;

var array;
var token = "token 1d0eea83c6bf238ec1d281e606d6d7d8c45ebfd3"

function get(name)
{
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}
//存放該repository的commit資料
var commitArray=[];
// 放圖資料
var commitChartArray=[];
var timelineDataArray=[];

var languageArray=[];
var commitMap = new Map();
$(document).ready(function(){
	var fullName = get('name');
	var object;
	var promises = [];
	//抓commit資料
	//因為不知道有幾頁，就全部跑，用length來判斷該頁面有沒有東西，如果沒有就不做事
	for(var i = 1 ;i <= 10; i++){
		var promise = $.ajax({
			url:"https://api.github.com/repos/"+fullName+"/commits?page="+i+"&per_page=100&access_token=1d0eea83c6bf238ec1d281e606d6d7d8c45ebfd3",
			cache:false,
			success:function(response){
				if(response.length!=0){
					// console.log(response);
					for(var j = 0;j < response.length;j++){
						// console.log(response[j].committer.login);
						object={"committer": (response[j].committer != null ? response[j].committer.login : ''),"message":response[j].commit.message,
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
		promises.push(promise);
	}
	Promise.all(promises).then(function(){
		commitArray = commitArray.sort(function (a, b) {
		tA = a;
		tB = b;
    	return timeCompare(a.date, b.date) ? 1 : -1;
 	   });
		
		for (var i = 0; i < commitArray.length; i++)
		{
			// console.log(getTimeFormat(commitArray[i].date));
			// if (!commitMap.has(getTimeFormat(commitArray[i].date)))
			// 	commitMap.set(getTimeFormat(commitArray[i].date), 1);
			// else
			// 	commitMap[getTimeFormat(commitArray[i].date)] = parseInt(commitMap[getTimeFormat(commitArray[i].date)]) + 1;	//-------- test----------
		}
		commitChartArray = Object.values(commitMap);
	})

	
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
	        	Authorization: token
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

	
	
	releaseArray = releaseArray.sort(function (a, b) {
		tA = a;
		tB = b;
		return timeCompare(a.updatedAt, b.updatedAt) ? 1 : -1;
    });
    // 設置 timeline array data
    for (var i = 0; i < releaseArray.length; i++)
    {
    	var arr = [];
    	arr.push(releaseArray[i].description);
    	timelineDataArray.push({'data':releaseArray[i].releaseName, 'time':releaseArray[i].updatedAt, 'note':arr})
    }

	//language
	$.ajax({
			method: "POST",
	    	url: "https://api.github.com/graphql",
	    	contentType: "application/json",
	      	headers: {
	        	Authorization: token
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
					drawPie(convertToD3Data(languageArray), '#chart', 600, 600, '#color-legend-area');
				}
				// console.log(languageArray);

			},
			error:function(e){
				console.log("get language error");
			}
		});



     // source = [{data: 'v5.0.1', time: '2013-04-16', note: ['add index.html', 'add search', ]}, {data: 'v5.0.2', time:'2013-04-22', note: ['add calendar', 'add keylabel']}, {data: 'v5.0.3', time:'2013-04-30', note: ['add note']}, {data: 'v5.0.4', time:'2013-05-04', note: ['update search', 'update calendar']}];

     // array = convertToTimelineData(source);
    // draw(container, array);
    // var versionIdArray = getVersionIdArray(array)
    // console.log(versionIdArray);
    // var btnArea = document.getElementById('btn-area');
    // for (var i = 0; i < versionIdArray.length; i++)
    // {
    //     btnArea.innerHTML += '<button onClick="moveToVersion(\'' + versionIdArray[i].start + '\',\'' + versionIdArray[i].end + '\')">' + versionIdArray[i].version + '</button>'
    // }
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

function getTimeFormat(time)
{
	var format = time.split(/-|:|T|Z| |\./);
	return format.join('');
}

// 輸入兩個 time, 若 timeA 較大則回傳 true，否則回傳 false
function timeCompare(timeA, timeB)
{
	var arrayA = typeof(timeA) == 'string' ? timeA.split(/-|:|T|Z| |\./) : timeA;
	var arrayB = typeof(timeB) == 'string' ? timeB.split(/-|:|T|Z| |\./) : timeB;
	for (var i = 0; i < 6; i++)
	{
		a = parseInt(arrayA[i] != undefined ? arrayA[i] : 0);
		b = parseInt(arrayB[i] != undefined ? arrayB[i] : 0);
		// console.log(a > b);
		if (a > b)
			return true;
		else if (a < b)
			return false;
	}
	return true;
}

function changeToPieChart()
{
	drawPie(convertToD3Data(languageArray), '#chart', 600, 600, '#color-legend-area');
}

function changeToBarChart()
{
	drawBar(convertToD3Data(languageArray), '#chart', 600, 900);
	$('#color-legend-area').html('');
}

function changeToRelease()
{
	$('#img-area').html('<div class="w3-col" style="width:70%;padding:25px;"><div id="mytimeline" class="timeline-area"></div></div>');
	container = document.getElementById('mytimeline');
    draw(container, convertToTimelineData(timelineDataArray) );
}

function changeToLanguage()
{
	$('#img-area').html('<div class="w3-col" style="width:50%;padding:25px;"><div id="chart"></div></div><div class="w3-col" style="width:20%;padding:25px;"><div id="color-legend-area"></div></div>');
	drawPie(convertToD3Data(languageArray), '#chart', 600, 600, '#color-legend-area');
}