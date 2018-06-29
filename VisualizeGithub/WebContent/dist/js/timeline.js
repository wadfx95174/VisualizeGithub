var timeline;
var colorArray = [{dark:'#CCFF33', light:'#EEFFBB'}, {dark:'#33FFDD', light:'#AAFFEE'}, {dark:'#FF8888', light:'#FFCCCC'}];

// 初始化 timeline 參數
var groups = new vis.DataSet([{id: 0, content: 'Releases'},{id: 1, content: 'Note'}]);
var options = {
    margin: {
      item: 20,
      axis: 40
    }
};

// 將資料轉為 timeline 可以吃進去的陣列
function convertToTimelineData(inputData)
{
    var outputData = [];
    for (var i = 0; i < inputData.length; i++)
    {
        // 設定 version 背景
        var backgroundVersionObject = {
            id: '' + i + '-bg-ver',
            content: inputData[i].data,
            start: inputData[i].time,
            end: i + 1 < inputData.length ? inputData[i + 1].time : new Date(),
            type: 'background',
            style: 'background-color:' + colorArray[i % 3].dark,
            group: 0
        }
        // 設定 note 背景
        var backgroundNoteObject = {
            id: '' + i + '-bg-note',
            content: '',
            start: inputData[i].time,
            end: i + 1 < inputData.length ? inputData[i + 1].time : new Date(),
            type: 'background',
            style: 'background-color:' + colorArray[i % 3].light,
            group: 1
        }
        outputData.push(backgroundVersionObject);
        outputData.push(backgroundNoteObject);

        // 設定 note
        var noteArray = inputData[i].note;
        for (var j = 0; j < noteArray.length; j++)
        {
            var noteObject = {
                id: '' + i + '-' + j,
                content: noteArray[j],
                start: inputData[i].time,
                type: 'point',
                group: 1
            }
            outputData.push(noteObject);
        }
    }
    // console.log(outputData);
    return outputData;
}

function getVersionIdArray(timelineData)
{
    var versionIdArray = [];
    for (var i = 0; i < timelineData.length; i++)
    {
        if (timelineData[i].type == 'background' && timelineData[i].content != '')
            versionIdArray.push({id: timelineData[i].id, version: timelineData[i].content, start: timelineData[i].start, end: timelineData[i].end});
    }
    return versionIdArray;
}

// 繪製 timeline
function draw(container, data)
{
	options.start = data[data.length-1].start;
	options.end = new Date().toISOString();
    timeline = new vis.Timeline(container, data, groups, options);
}

// 畫面移動至選定 id 位置
function moveToVersion(start, end)
{
    // console.log(start);
    // console.log(end);
    timeline.setWindow(start, end);
    // timeline.fit();
    // timeline.focus(id, {duration: 1000});
}