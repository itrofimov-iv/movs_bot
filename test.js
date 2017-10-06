function isEvenWeek(mdate){
    var oneweek = 604800000;
    var firstweek = 1506279600000;
    var temp = Math.trunc((mdate - firstweek) / oneweek) % 2;
    return temp;
}

var date = new Date();
var date2 = new Date(2017,9,11,0,0,0,0)
console.log("date", date.getTime());
isEvenWeek(date2.getTime())