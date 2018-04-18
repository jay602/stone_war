var Utility = (function(){

    　　　　var getCurrentTime = function(){
        　　　　　　 var date = new Date();
                    var year=date.getFullYear(); //获取当前年份
                    var mon=date.getMonth()+1; //获取当前月份
                    var da=date.getDate(); //获取当前日
                    var day=date.getDay(); //获取当前星期几
                    var hour=date.getHours(); //获取小时
                    var minute=date.getMinutes(); //获取分钟
                    var second=date.getSeconds(); //获取秒
                    var millseocnd =date.getMilliseconds()
                    var str = "当前时间: " + hour + ":" + minute + ":" + second + "  " +  millseocnd;
    　　　　};
    
    　　　　return {
                getCurrentTime : getCurrentTime
    　　　　};
    
    　　})();


module.exports = Utility;