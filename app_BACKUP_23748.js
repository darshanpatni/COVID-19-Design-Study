var STATE_HASHMAP = new Map();
STATE_HASHMAP

drawCounties();
drawStates();

setTimeout(() => {  
console.log(getCumulitiveDataForState("NY"));
drawLineChartForState("NY");
}, 2000);

