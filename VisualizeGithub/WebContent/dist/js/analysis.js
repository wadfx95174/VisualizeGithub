function get(name)
{
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}
$(document).ready(function(){
	var fullName = get('text');
	var date = get('date');
	$.ajax({
		url:"https://api.github.com/repos/freeCodeCamp/freeCodeCamp/commits&per_page=100&access_token=727d34d1872545e5859ec1c969dea1f93a20d253"
	});

});
