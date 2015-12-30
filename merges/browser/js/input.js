var setupInputEvents = function() {
    document.addEventListener('keydown', handleKeydown, false);
    document.addEventListener('keyup', handleKeyup, false);
}

var handleKeydown = function(e) {
    switch(e.keyCode) {
        case 37:
            input.x_acc = -1;
            break;
        case 39:
            input.x_acc = 1;
            break;
        case 38:
            input.y_acc = -1;
            break;
        case 40:
            input.y_acc = 1;
            break;
    }
}

var handleKeyup = function(e) {
    switch(e.keyCode) {
        case 37:
        case 39:
            input.x_acc = 0;
            break;
        case 38:
        case 40:
            input.y_acc = 0;
            break;
    }
}
