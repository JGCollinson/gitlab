
function countup(val) { 
    for (var j = 2; j < val; j++) {
            if((val % j) === 0) {
            return false;
        }
        else {
            return true;
        }
    }
}