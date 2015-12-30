var setupInputEvents = function() {
    navigator.accelerometer.watchAcceleration(
        handleAccelerometer, handleAccelerometerFailure,
        { 'frequency': 100 });
}

var handleAccelerometer = function(acc) {
    var thres = 5;

    if(Math.abs(acc.x) <= 1) {
        input.x_acc = 0;
    } else {
        var sign = acc.x?acc.x<0?-1:1:0;
        input.x_acc = Math.abs(acc.x) > thres ? -sign * Math.log(thres) : -sign * Math.log(Math.abs(acc.x));
    }

    if(Math.abs(acc.y) <= 1) {
        input.y_acc = 0;
    } else {
        var sign = acc.y?acc.y<0?-1:1:0;
        input.y_acc = Math.abs(acc.y) > thres ? sign * Math.log(thres) : sign * Math.log(Math.abs(acc.y));
    }
}

var handleAccelerometerFailure = function() {
    console.log('Accelerometer fails');
}
