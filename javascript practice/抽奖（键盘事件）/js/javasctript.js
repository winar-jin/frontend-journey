var data=['Phone5','Ipad','三星笔记本','佳能相机','惠普打印机','谢谢参与','50元充值卡','1000元超市购物券'],
    timer=null,
    flag=0;

function $(tag){
	return document.getElementById(tag);
}

window.onload=function(){
	// var play=document.getElementById('play'),
 //        stop=document.getElementById('stop');
    
    var play =$('play'),stop=$('stop');
    // 开始抽奖
    play.onclick=playFun;
    stop.onclick=stopFun;

   // 键盘事件
    // 自己错的那一行→document.keyup=function(event){
    document.onkeyup=function(event){
    	event=event || window.event;
    	if(event.keyCode==13){
    		if(flag===0){
    			playFun();
    			flag=1;
    		}else{
    			stopFun();
    			flag=0;
    		}
    	}
    }
  
    function playFun(){
    	var title=$('title');
    	clearInterval(timer);
    	timer=setInterval(function(){
    		var random=Math.floor(Math.random()*data.length);
    	    title.innerHTML=data[random];
    	},50);
    	play.style.background='#ccc';
    }
    
    function stopFun(){
    	clearInterval(timer);
    	play.style.background='#036';
    }
}



