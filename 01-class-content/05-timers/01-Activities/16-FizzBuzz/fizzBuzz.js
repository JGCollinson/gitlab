
function countup() { 
var val = prompt("Input Prime Number"))
for (var j = 2; j < val; j++) {
    val = parseInt(val);
    if(val%j === 0) {
        return false;
    }
    else {return true}
}
}

countup();