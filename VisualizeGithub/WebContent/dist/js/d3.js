// var height = 400;
// var width = 400;
// var radius = width / 2;
var state = 0;	// 按鈕畫圖方式  0:長條  1:圓餅  2:甜甜圈

var data1 = [{data:'英國',value:90},{data:'美國',value:70},{data:'法國',value:90},{data:'德國',value:100},{data:'中國',value:140},{data:'俄國',value:110},{data:'韓國',value:10},{data:'泰國',value:62},{data:'我是零',value:0}]; //測資1
var data2 = [{data:'英國',value:90},{data:'美國',value:70},{data:'法國',value:40},{data:'德國',value:100},{data:'中國',value:140},{data:'俄國',value:110},{data:'韓國',value:10},{data:'泰國',value:62},{data:'美國',value:70},{data:'法國',value:40},{data:'德國',value:100},{data:'中國',value:140},{data:'俄國',value:110},{data:'韓國',value:10},{data:'泰國',value:62}]; //測資2
var data3 = [{data:'英國',value:140},{data:'美國',value:180},{data:'法國',value:100}]; //測資3
var data4 = [{data: "freeCodeCamp", value: 292255},{data: "vega", value: 26043},{data: "spritejs", value: 289},{data: "iClient-JavaScript", value: 173},{data: "D3", value: 0},{data: "Stadium1", value: 0},{data: "D3_study", value: 0},{data: "D3HW", value: 0},{data: "d3_DataJournalism", value: 0},{data: "hw-16-D3", value: 0},{data: "D3HW", value: 0},{data: "D3-Practice", value: 0},{data: "cs-alumni-statistics", value: 0},{data: "D3HW", value: 0},{data: "D3.js-Homework", value: 0},{data: "interactiveBarGraph", value: 0}];
var podiumData = [{data:'',value:140},{data:'',value:180},{data:'',value:100}]; //獎台資料

var currentData = data1;
	
var color = d3.scale.category20(); //設定圓餅圖顏色
var selectedArea = '#area-0';



window.addEventListener('load', start, false);

function start()
{
	// drawPie(data1, '#chart', 400, 400);
	// drawPie(data2, '#bigChart', 400, 400);
// 	drawPie(data2, '#area-1', 100, 100);
// 	drawPie(data3, '#area-2', 100, 100);
}

function convertToD3Data(data)
{
	// console.log(data);
	var d3Data = [];
	for (var i = 0; i < data.length; i++)
	{
		if (data[i].value != 0)
			d3Data.push(data[i]);
	}
	d3Data = d3Data.sort(function(a, b){return b.value-a.value}).slice(0, 10);
	return d3Data;
}

function changeChart(chart, height, width)
{
	if (chart == 'bar')
		drawBar(currentData, selectedArea, height, width);
	else if (chart == 'pie')
		drawPie(currentData, selectedArea, height, width);
	else if (chart == 'donut')
		drawDonut(currentData, selectedArea, height, width);
	else if (chart == 'podium')
		drawPodium(currentData, selectedArea, height, width);
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
}

function drawPodium(data, area, height, width)
{
	var svg = d3.select(area).html('').append("svg")
				.attr({'width':width, 'height':height});

	// 取前三名
	var top3 = data.sort(function(a, b){return b.value-a.value}).slice(0, 3);
	podiumData[0].data = top3[1].data;
	podiumData[1].data = top3[0].data;
	podiumData[2].data = top3[2].data;

	svg.selectAll('rect').data(podiumData)
		.enter()
		.append('rect')
		.attr({ 'fill': function(d, i){ return color(i); }
				,'width':height / podiumData.length
				,'height':function(d){ return d.value; }
				,'x':function(d, i){ return i * height / podiumData.length; } 
				,'y':function(d){ return 200 - d.value; } })

	svg.selectAll('text').data(podiumData)
		.enter()
		.append('text')
		.text(function(d){ console.log(d); return d.data; })
		.attr({'fill':'#000'
				,'x':function(d, i){ return i * height / podiumData.length + 20; }
				,'y':function(d){ return 200 - d.value; } })
}

function drawBar(data, area, height, width)
{
	var svg = d3.select(area).html('').append('svg')
				.attr({'width':width, 'height':height});

	var valueTotal = 0;
	console.log(data);
	for (var i = 0; i < data.length; i++)
	{
		console.log(data[i]);
		valueTotal += data[i].value;
	}

	var legendData = [];

	svg.selectAll('rect').data(data)
		.enter()
		.append('rect')
		.attr({ 'fill': function(d, i){ 
					var newObject = {'color': color(d.value + i), 'data': d.data}; 
					legendData.push(newObject); 
					return color(d.value + i); }
				,'width':0
				,'height':height / data.length - 5
				,'x':0
				,'y':function(d, i){return i * height / data.length; } })
		.transition()
		.duration(1500)
		.attr({'width':function(d){ return d.value / valueTotal * (width-50); } });

	svg.selectAll('text').data(data)
		.enter()
		.append('text')
		.text(function(d){ return 0; })
		.attr({'fill':'#000'
				,'x':10
				,'y':function(d, i){ return i * height / data.length + height / data.length / 2; } })
		.transition()
		.duration(1500)
		.attr({'x':function(d){ return d.value / valueTotal * (width-50); } })
		.tween('number',function(d){
		    var i = d3.interpolateRound(0, d.value);
		      return function(t) {
			    this.textContent = i(t);
	 		 };
		});

	var tooltip = d3.select("body")
		.append("div")
		.attr("class","tooltip")
		.style("opacity",0.0);

	svg.selectAll('rect').on('mouseover', function(d){
 		tooltip.html(d.data + "" + "<br />" + d.value)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity",1.0);
	})
	svg.selectAll('rect').on('mousemove', function(){
	    tooltip.style("left", (d3.event.pageX) + "px")
	        .style("top", (d3.event.pageY + 20) + "px");
	})
	svg.selectAll('rect').on('mouseout', function(){
		d3.select(this)
	        .transition()
	        .duration(400)
	        .attr("transform", "translate("+ 0 +", "+ 0 +")") ;
	    tooltip.style("opacity",0.0);
	})

	legendArea = document.getElementById('color-legend-area');
	legendArea.innerHTML = '';
	for (var i = 0; i < legendData.length; i++)
	{
		legendArea.innerHTML += '<div class="color-legend" style="background:' + legendData[i].color + '"></div><span class="color-description">' + legendData[i].data + '</span>';
	}
}

function drawSmallPie(data, area, height, width)
{
	var tooltip = d3.select("body")
		.append("div")
		.attr("class","tooltip")
		.style("opacity",0.0);
	var legendData = [];
	// 設定半徑為寬度一半
	var radius = width / 2;

	// 設定 pie 要用的 arc
	var arc = d3.svg.arc()
	    .outerRadius(radius - width / 10)
	    .innerRadius(0);

	// pie 裡面文字的位置
	var labelArc = d3.svg.arc()
	    .outerRadius(radius)
	    .innerRadius(radius-10);

	// 生成 pie 的函式
	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.value; });

	// 定義 pie
	var svg = d3.select(area).html('').append('svg')
		.attr({'width':width, 'height':height})
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
	    .style("fill", function(d, i) { 
	    		var newObject = {'color': color(d.data.value + i), 'data': d.data.data};
	    		legendData.push(newObject); 
	    		return color(d.data.value + i); })
	    .transition()
	    .duration(1000)
	    .attrTween("d", tweenPie);
	        
	// append text 
	g.append("text")
	    .transition()
	    .duration(1000)
	    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
	    .attr("dx", "-.85em")
	    .attr("dy", ".35em")
	    .text(function(d) {  return d.endAngle - d.startAngle > 0.3 ? d.data.value : ''; });

	// 滑鼠移入
	g.on("mouseover",function(){
	    var target = d3.select(this);
	    var d = target.datum();
	    var dgre = (d.endAngle-d.startAngle) / 2 + d.startAngle;
	    var dis = width / ((width + 40) / 15); //distance
	     
	    var x = d3.round(Math.sin(dgre), 15) * dis;
	    var y = -d3.round(Math.cos(dgre), 15) * dis;
	        target
	        .transition()
	        .duration(700)
	        .attr("transform", "translate("+ x +", "+ y +")")
	        .ease("bounce") ;
	      // console.log("x:"+x+" y:"+y);

	    tooltip.html(d.data.data + "" + "<br />" + d.data.value)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity",1.0);
	});

	g.on("mousemove", function(){
	    tooltip.style("left", (d3.event.pageX) + "px")
	        .style("top", (d3.event.pageY + 20) + "px");
	})

	// 滑鼠移開
	g.on("mouseout",function(){
	    d3.select(this)
	        .transition()
	        .duration(400)
	        .attr("transform", "translate("+ 0 +", "+ 0 +")") ;
	    tooltip.style("opacity",0.0);
 	});

	// pie 動畫
	function tweenPie(b) {
	    b.innerRadius = 0;
	    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
	    return function(t) { return arc(i(t)); };
	}
}

function drawPie(data, area, height, width, colorArea)
{
	var tooltip = d3.select("body")
		.append("div")
		.attr("class","tooltip")
		.style("opacity",0.0);
	var legendData = [];
	// 設定半徑為寬度一半
	var radius = width / 2;

	// 設定 pie 要用的 arc
	var arc = d3.svg.arc()
	    .outerRadius(radius - width / 10)
	    .innerRadius(0);

	// pie 裡面文字的位置
	var labelArc = d3.svg.arc()
	    .outerRadius(radius-30)
	    .innerRadius(radius-30);

	// 生成 pie 的函式
	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.value; });

	// 定義 pie
	var svg = d3.select(area).html('').append('svg')
		.attr({'width':width, 'height':height})
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
	    .style("fill", function(d, i) { 
	    		var newObject = {'color': color(d.data.value + i), 'data': d.data.data};
	    		legendData.push(newObject); 
	    		return color(d.data.value + i); })
	    .transition()
	    .duration(1000)
	    .attrTween("d", tweenPie);
	        
	// append text
	g.append("text")
	    .transition()
	    .duration(1000)
	    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
	    .attr("dx", "-.85em")
	    .attr("dy", ".35em")
	    .text(function(d) {  return d.endAngle - d.startAngle > 0.3 ? d.data.value : ''; });

	// 滑鼠移入
	g.on("mouseover",function(){
	    var target = d3.select(this);
	    var d = target.datum();
	    var dgre = (d.endAngle-d.startAngle) / 2 + d.startAngle;
	    var dis = width / ((width + 40) / 20); //distance
	     
	    var x = d3.round(Math.sin(dgre), 15) * dis;
	    var y = -d3.round(Math.cos(dgre), 15) * dis;
	        target
	        .transition()
	        .duration(700)
	        .attr("transform", "translate("+ x +", "+ y +")")
	        .ease("bounce") ;
	      // console.log("x:"+x+" y:"+y);

	    tooltip.html(d.data.data + "" + "<br />" + d.data.value)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity",1.0);
	});

	g.on("mousemove", function(){
	    tooltip.style("left", (d3.event.pageX) + "px")
	        .style("top", (d3.event.pageY + 20) + "px");
	})

	// 滑鼠移開
	g.on("mouseout",function(){
	    d3.select(this)
	        .transition()
	        .duration(400)
	        .attr("transform", "translate("+ 0 +", "+ 0 +")") ;
	    tooltip.style("opacity",0.0);
 	});

	// pie 動畫
	function tweenPie(b) {
	    b.innerRadius = 0;
	    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
	    return function(t) { return arc(i(t)); };
	}

	if (colorArea != null)
	{
		legendArea = $(colorArea);
		legendArea.html('');
		for (var i = 0; i < legendData.length; i++)
		{
			legendArea.append('<div class="color-legend" style="background:' + legendData[i].color + '"></div><span class="color-description">' + legendData[i].data + '</span>');
		}
	}
}

function drawDonut(data, area, height, width)
{
	var tooltip = d3.select("body")
		.append("div")
		.attr("class","tooltip")
		.style("opacity",0.0);

	var legendData = [];
		
	// 設定半徑為寬度一半
	var radius = width / 2;

	// 設定 Donut 要用的 arc
	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(radius - 70);

	var arcOver = d3.svg.arc()
	    .outerRadius(radius + 10)
	    .innerRadius(radius - 50);

	// Donut 裡面文字的位置
	var labelArc = d3.svg.arc()
	    .outerRadius(radius - 40)
	    .innerRadius(radius - 50);

	// 生成 Donut 的函式
	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.value; });

	// 定義 Donut
	var svg = d3.select(area).html('').append('svg')
		.attr({'width':width, 'height':height})
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
	    .style("fill", function(d, i) { 
	    		var newObject = {'color': color(d.data.value + i), 'data': d.data.data};
	    		legendData.push(newObject);
	    		 return color(d.data.value + i);})
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

	// 滑鼠移入
	g.on("mouseover",function(){
	    var target = d3.select(this);
	    var d = target.datum();
	    var dgre = (d.endAngle-d.startAngle) / 2 + d.startAngle;
	    var dis = width / ((width + 40) / 20); //distance
	     
	    var x = d3.round(Math.sin(dgre), 15) * dis;
	    var y = -d3.round(Math.cos(dgre), 15) * dis;
	        target
	        .transition()
	        .duration(700)
	        .attr("transform", "translate("+ x +", "+ y +")")
	        .ease("bounce") ;
	      // console.log("x:"+x+" y:"+y);

	    tooltip.html(d.data.data + "" + "<br />" + d.data.value)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity",1.0);
	});

	g.on("mousemove", function(){
	    tooltip.style("left", (d3.event.pageX) + "px")
	        .style("top", (d3.event.pageY + 20) + "px");
	})

	// 滑鼠移開
	g.on("mouseout",function(){
	    d3.select(this)
	        .transition()
	        .duration(400)
	        .attr("transform", "translate("+ 0 +", "+ 0 +")") ;
	    tooltip.style("opacity",0.0);
 	});

	// Donut 動畫
	function tweenDonut(b) {
	    b.innerRadius = 0;
	    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
	    return function(t) { return arc(i(t)); };
	}

	legendArea = document.getElementById('color-legend-area');
	legendArea.innerHTML = '';
	for (var i = 0; i < legendData.length; i++)
	{
		legendArea.innerHTML += '<div class="color-legend" style="background:' + legendData[i].color + '"></div><span class="color-description">' + legendData[i].data + '</span>';
	}
}