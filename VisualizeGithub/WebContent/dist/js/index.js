$(document).ready(function(){
	var img;
	//star排行榜
	$.ajax({
		method: "POST",
    	url: "https://api.github.com/graphql",
    	contentType: "application/json",
      	headers: {
        	Authorization: "bearer 7b2797e105897080e19b0eba56428fe55a8945ba"
      	},
      	data: JSON.stringify({
      		query:
      		'{'
      		+'search(query: "stars:>100000 sort:stars-desc", type: REPOSITORY, first: 3) {'
      			+'edges {'
					+'node {'
						+'... on Repository {'
				        	+'nameWithOwner '
				          	+'description '
				       	+'}'
					+'}'
				+'}'
			+'}'
			+'}'
		}),
		cache:false,
		success:function(response){
			console.log(response);
			var temp;
			for(var i = 0;i < 3;i++){
				if(i==0){
					img = '<img class="rotate" src="img/intro/silver.jpg" alt="Generic placeholder image" style="width:160px;height:160px">';
					temp = 1;
				}				
				else if(i==1){
					img = '<img class="rotate" src="img/intro/gold.jpg" alt="Generic placeholder image" style="width:200px;height:200px">';
					temp = 0;
				}
				else {
					img = '<img class="rotate" src="img/intro/copper.jpg" alt="Generic placeholder image" style="width:120px;height:120px">';
					temp = 2;
				}
				$("#starLeaderboard").append('<div class="col-sm-4 wow fadeInDown text-center">'
						+img
						+'<h3 class="ellipsis">'+response.data.search.edges[temp].node.nameWithOwner+'</h3>'
						+'<p class="lead">'+response.data.search.edges[temp].node.description+'</p>'
						+'<p><a href="analysis.html?name='+response.data.search.edges[temp].node.nameWithOwner+'" class="btn btn-embossed btn-primary view" role="button" style="margin-right:10px;">分析</a>'
						+'<a href="https://github.com/'+response.data.search.edges[temp].node.nameWithOwner+'" class="btn btn-embossed btn-primary view" role="button">連結</a></p>'
						+'</div>');
				$('.ellipsis').tooltip({title:response.data.search.edges[temp].node.nameWithOwner ,  placement:"bottom", animation: true});
			}
		},
		error:function(e){
			console.log("star trending init error");
		}
	});

	//fork排行榜
	$.ajax({
		method: "POST",
    	url: "https://api.github.com/graphql",
    	contentType: "application/json",
      	headers: {
        	Authorization: "bearer 7b2797e105897080e19b0eba56428fe55a8945ba"
      	},
      	data: JSON.stringify({
      		query:
      		'{'
      		+'search(query: "forks:>30000 sort:forks-desc", type: REPOSITORY, first: 3) {'
      			+'edges {'
					+'node {'
						+'... on Repository {'
				        	+'nameWithOwner '
				          	+'description '
				       	+'}'
					+'}'
				+'}'
			+'}'
			+'}'
		}),
		cache:false,
		success:function(response){
			for(var i = 0;i < 3;i++){
				var temp;
				if(i==0){
					img = '<img class="rotate" src="img/intro/silver.jpg" alt="Generic placeholder image" style="width:160px;height:160px">';
					temp = 1;
				}				
				else if(i==1){
					img = '<img class="rotate" src="img/intro/gold.jpg" alt="Generic placeholder image" style="width:200px;height:200px">';
					temp = 0;
				}
				else {
					img = '<img class="rotate" src="img/intro/copper.jpg" alt="Generic placeholder image" style="width:120px;height:120px">';
					temp = 2;
				}
				$("#forkLeaderboard").append('<div class="col-sm-4 wow fadeInDown text-center">'
						+img
						+'<h3 class="ellipsis">'+response.data.search.edges[temp].node.nameWithOwner+'</h3>'
						+'<p class="lead">'+response.data.search.edges[temp].node.description+'</p>'
						+'<p><a href="analysis.html?name='+response.data.search.edges[temp].node.nameWithOwner+'" class="btn btn-embossed btn-primary view" role="button" style="margin-right:10px;">分析</a>'
						+'<a href="https://github.com/'+response.data.search.edges[temp].node.nameWithOwner+'" class="btn btn-embossed btn-primary view" role="button">連結</a></p>'
						+'</div>');
				$('.ellipsis').tooltip({title:response.data.search.edges[temp].node.nameWithOwner ,  placement:"bottom", animation: true});
			}
		},
		error:function(e){
			console.log("fork trending init error");
		}
	});
})

$('#searchButton').click(function(){
	$('#target').submit();
})