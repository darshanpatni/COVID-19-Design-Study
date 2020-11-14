var STATE_HASHMAP = new Map();
STATE_HASHMAP

drawCounties();
drawStates();

setTimeout(() => {  
console.log(getCumulitiveDataForState("AK"));
drawLineChartForState("AK");
//TODO call drawLineChartForState here
}, 2000);
