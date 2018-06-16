var height = 400;
var width = 400;
var radius = width / 2;
var state = 0;	// 按鈕畫圖方式  0:長條  1:圓餅  2:甜甜圈

var data1 = [{data:'英國',value:90},{data:'美國',value:70},{data:'法國',value:40},{data:'德國',value:100},{data:'中國',value:140},{data:'俄國',value:110},{data:'韓國',value:10},{data:'泰國',value:62}]; //測資1
var data2 = [{data:'英國',value:90},{data:'美國',value:70},{data:'法國',value:40},{data:'德國',value:100},{data:'中國',value:140},{data:'俄國',value:110},{data:'韓國',value:10},{data:'泰國',value:62},{data:'美國',value:70},{data:'法國',value:40},{data:'德國',value:100},{data:'中國',value:140},{data:'俄國',value:110},{data:'韓國',value:10},{data:'泰國',value:62}]; //測資2
var data3 = [{data:'英國',value:140},{data:'美國',value:180},{data:'法國',value:100}]; //測資3

var currentData = data1;
	
var color = d3.scale.category20(); //設定圓餅圖顏色

window.addEventListener('load', start, false);

function start()
{
var svg = d3.select("#chartArea").append("svg")
    .attr({'width':width,'height':height});		//設定一個svg的長寬

	drawPie(currentData);
}

function changeChart()
{
	// var data = [{x:1,w:90},{x:2,w:70},{x:3,w:40},{x:4,w:100},{x:5,w:140},{x:6,w:110},{x:7,w:10},{x:8,w:62}]; //測資
	if (state == 0)
	{
		drawBar(currentData);
	}
	else if (state == 1)
	{
		drawPie(currentData);
	}
	else if (state == 2)
	{
		drawDonut(currentData);
	}
	else
	{
		drawPodium(currentData);
	}
	state = (state + 1) % 4;
}

function changeData()
{
	currentData == data1
	if (currentData == data1)
	{
		currentData = data2;
	}
	else if (currentData == data2)
	{
		currentData = data3;
	}
	else
	{
		currentData = data1;
	}
	if (state == 0)
	{
		drawPodium(currentData);
	}
	else if (state == 1)
	{
		drawBar(currentData);
	}
	else if (state == 2)
	{
		drawPie(currentData);
	}
	else
	{
		drawDonut(currentData);
	}
}

function drawPodium(data)
{
	var svg = d3.select('#chartArea').html('').append("svg").attr({'width':width, 'height':height});

	svg.selectAll('rect').data(data)
		.enter()
		.append('rect')
		.attr({ 'fill': function(d){ return color(d.value); }
				,'width':height / data.length
				,'height':function(d){ return d.value; }
				,'x':function(d, i){ return i * height / data.length; } 
				,'y':function(d){ return 200 - d.value; } })

	svg.selectAll('text').data(data)
		.enter()
		.append('text')
		.text(function(d){ return d.data; })
		.attr({'fill':'#000'
				,'x':function(d, i){ return i * height / data.length + 20; }
				,'y':function(d){ return 200 - d.value; } })
}

function drawBar(data)
{
	var svg = d3.select('svg').html('').attr({'width':width, 'height':height});

	svg.selectAll('rect').data(data)
		.enter()
		.append('rect')
		.attr({ 'fill': function(d){ return color(d.value); }
				,'width':0
				,'height':height / data.length - 5
				,'x':0
				,'y':function(d, i){return i * height / data.length; } })
		.transition()
		.duration(1500)
		.attr({'width':function(d){ return d.value; } });

	svg.selectAll('text').data(data)
		.enter()
		.append('text')
		.text(function(d){ return 0; })
		.attr({'fill':'#000'
				,'x':10
				,'y':function(d, i){ return i * height / data.length + height / data.length / 2; } })
		.transition()
		.duration(1500)
		.attr({'x':function(d){ return d.value + 10; } })
		.tween('number',function(d){
		    var i = d3.interpolateRound(0, d.value);
		      return function(t) {
			    this.textContent = i(t);
	 		 };
		});
}

function drawPie(data)
{
	// 設定 pie 要用的 arc
	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

	// pie 裡面文字的位置
	var labelArc = d3.svg.arc()
	    .outerRadius(radius - 40)
	    .innerRadius(0);

	// 生成 pie 的函式
	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.value; });

	// 定義 pie
	var svg = d3.select("svg").html('').attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	// SVG 裡面相同的元素 g
	var g = svg.selectAll(".arc")
	    .data(pie(data))
	    .enter().append("g")
	    .attr("class", "arc");

	// append path 
	g.append("path")
	    .attr("d", arc)
	    .style("fill", function(d) { return color(d.data.value); })
	    .transition()
	    .duration(1000)
	    .attrTween("d", tweenPie);
	        
	// append text
	g.append("text")
	    .transition()
	    .duration(1000)
	    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
	    .attr("dy", ".35em")
	    .text(function(d) { return d.data.value; });

	// pie 動畫
	function tweenPie(b) {
	  b.innerRadius = 0;
	  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
	  return function(t) { return arc(i(t)); };
	}
}

function drawDonut(data)
{
	// 設定 Donut 要用的 arc
	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(radius - 70);

	// Donut 裡面文字的位置
	var labelArc = d3.svg.arc()
	    .outerRadius(radius - 40)
	    .innerRadius(radius - 50);

	// 生成 Donut 的函式
	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.value; });

	// 定義 Donut
	var svg = d3.select("svg").html('').attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	// SVG 裡面相同的元素 g
	var g = svg.selectAll(".arc")
	    .data(pie(data))
	    .enter().append("g")
	    .attr("class", "arc");

	// append path 
	g.append("path")
	    .attr("d", arc)
	    .style("fill", function(d) { return color(d.data.value); })
	    .transition()
	    .duration(1000)
	    .attrTween("d", tweenDonut);
	        
	// append text('some text')
	g.append("text")
	    .transition()
	    .duration(1000)
	    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
	    .attr("dy", ".35em")
	    .text(function(d) { return d.data.value; });

	// Donut 動畫
	function tweenDonut(b) {
	  b.innerRadius = 0;
	  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
	  return function(t) { return arc(i(t)); };
	}
}