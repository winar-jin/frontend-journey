let http = require('http');
let cheerio = require('cheerio');
let link = 'http://www.imooc.com/learn/348';
// function filterContent(html){
//     var $ = cheerio.load(html);
//     var chapters = $('.mod-chapters').children(); 
//     var courseData = []; 
//     chapters.each(function(item) { 
//         var chapter = $(this); 
//         var chapterTitle = chapter.find('.chapter h3 strong').text().trim();
//         var videos = $(this).children('li'); 
//         var chapterData = { chapterTitle: chapterTitle, videos: [] }; 
//         videos.each(function(item) {
//             var video = $(this).find('.J-media-item');
//             console.log(video);            
//             videoTitle = video.contents().filter(function () { return this.nodeType == 3; }).text().trim().split('\n'); 
//             videoId = video.attr('href').split('video/')[1];
//             chapterData.videos.push({ title: videoTitle, id: videoId }); 
//         });     
//         courseData.push(chapterData); 
//     }); 
//     return courseData;
// }

function filterChapters(html) { 
    // cheerio加载html 
    var $ = cheerio.load(html); 
    var chapters = $('.mod-chapters'); 
    var courseData = []; 
    var chapter, Title, videos, chapterData; 
    var videos, videoTitle, id; 
    chapters.each(function (value) { 
        chapter = $(this); 
        /** nodeType返回值说明 * 1-ELEMENT * 2-ATTRIBUTE * 3-TEXT * 4-CDATA * 5-ENTITY REFERENCE * 6-ENTITY * 7-PI (processing instruction) * 8-COMMENT * 9-DOCUMENT * 10-DOCUMENT TYPE * 11-DOCUMENT FRAGMENT * 12-NOTATION */ 
        // 过滤不提取子类中的text 
        Title = chapter.find('strong').contents().filter(function () { return this.nodeType == 3; }).text().trim(); 
        chapterData = { "chapterTitle": Title, "videos": [] } 
        videos = chapter.find('.video').children('li');
        videos.each(function (value) { video = $(this).find('.J-media-item'); 
        // 这个title包含了video的title和这个video的时间,两者用换行符分割 
        videoTitles = video.contents().filter(function () { return this.nodeType == 3; }).text().trim().split('\n'); 
        id = video.attr('href').split('video/')[1]; 
        chapterData.videos.push({ "title": videoTitles[0].trim(), "time": videoTitles[1].trim(), "id": id }); }); 
        courseData.push(chapterData); }); return courseData; }

function printCoursrInfo(courseData) { 
    var courseMessage = ''; 
    courseData.forEach(function (value, index) { 
        courseMessage += value.chapterTitle + '\n'; 
        value.videos.forEach(function (value, index) { 
            courseMessage += '[' + value.id + '] ' + value.title + ' time:' + value.time + '\n'; }); 
            courseMessage += '\n'; }); 
            console.log(courseMessage); 
        }

http.get(link, res => {
    let html ='';
    res.on('data', data => {
        html += data;
    });
    res.on('end',() => {
        let content = filterChapters(html);
        printCoursrInfo(content);
        console.log('no message!');
    });
}).on('error', (e) => {
    console.log('There has a error!');
});