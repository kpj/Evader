var input = { 'x_acc': 0, 'y_acc': 0 };

////////////////
// Player's ship
var Ship = function(img_path, x, y) {
    this.pos = { 'x': x, 'y': y };
    this.size = { 'w': 20, 'h': 5 };
    this.v = { 'x': 5, 'y': 0 }; // velocity

    this.img = new Image(this.size.w, this.size.h);
    this.img.src = img_path;

    this.remove = false;
}

Ship.prototype.render = function(ctx) {
    ctx.drawImage(
        this.img,
        this.pos.x - this.size.w/2, this.pos.y - this.size.h/2);
}

Ship.prototype.update = function() {
    this.pos.x += input.x_acc * this.v.x;
    this.pos.y += input.y_acc * this.v.y;

    if(this.pos.x - this.size.w/2 < 0) {
        this.pos.x = this.size.w/2;
    } else if(this.pos.x + this.size.w/2 > window.innerWidth) {
        this.pos.x = window.innerWidth - this.size.w/2;
    }
    if(this.pos.y - this.size.h/2 < 0) {
        this.pos.y = this.size.h/2;
    } else if(this.pos.y + this.size.h/2 > window.innerHeight) {
        this.pos.y = window.innerHeight - this.size.h/2;
    }
}

///////////
// Obstacle
var Obstacle = function(d1, d2) {
    this.d1 = d1;
    this.d2 = d2;

    this.pos = 0;
    this.v = 5;
    this.remove = false;
}

Obstacle.prototype.render = function(ctx) {
    ctx.fillStyle = '#0f0';

    ctx.fillRect(0, this.pos, this.d1, 5);
    ctx.fillRect(this.d2, this.pos, window.innerWidth-this.d2, 5);
}

Obstacle.prototype.update = function() {
    this.pos += this.v;

    if(this.pos > window.innerHeight) {
        this.remove = true;
    }
}

Obstacle.prototype.hit = function(ship) {
    if(
        this.pos <= ship.pos.y+ship.size.h/2 &&
        this.pos >= ship.pos.y-ship.size.h/2 &&
        (this.d1 >= ship.pos.x-ship.size.w/2 ||
        this.d2 <= ship.pos.x+ship.size.w/2)
    ) {
        return true;
    }
    return false;
}

//////////////////
// Level generator
var LevelGenerator = function() {
    this.last_action = Date.now();
    this.interval = 2000;
}

LevelGenerator.prototype.updateStage = function(state) {
    var cur = Date.now();
    if(cur - this.last_action < this.interval) return;
    this.last_action = Date.now();

    var width = getRandom(30, 100);
    var d1 = getRandom(0, window.innerWidth-width);
    state.push(new Obstacle(d1, d1+width));
}

///////////////////
// Main game object
var Game = function(width, height) {
    this.width = width;
    this.height = height;

    this.score = 0;
    this.obstacles = [];
    this.generator = new LevelGenerator();
    this.ship = new Ship(
        'img/ship.png', this.width/2, this.height-this.height/10);

    this.ctx = $('#field')[0].getContext('2d');
    this.ctx.canvas.width = this.width;
    this.ctx.canvas.height = this.height;
}

Game.prototype.init = function() {
    this.gloop = setInterval(this.gameLoop.bind(this), 50);
}

Game.prototype.gameLoop = function() {
    this.update();
    this.render();
}

Game.prototype.render = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ship.render(this.ctx);
    this.obstacles.forEach(function(ele, i, arr) {
        ele.render(this.ctx);
    }, this);
}

Game.prototype.update = function() {
    this.ship.update();
    this.obstacles.forEach(function(ele, i, arr) {
        ele.update();
        if(ele.hit(this.ship)) {
            stopGame(this.gloop);
        }

        if(ele.remove){
            arr.splice(i, 1);
        }
    }, this);

    this.generator.updateStage(this.obstacles);

    this.score++;
    $('#score').text(this.score);
}

////////////////////
// Wrapper functions
var startGame = function() {
    $('body').off('click');
    $('#welcome').hide();

    var game = new Game(window.innerWidth, window.innerHeight);
    game.init();
}

var stopGame = function(loop) {
    clearInterval(loop);
    $('#welcome').show();

    $('body').on('click', function() {
        startGame();
    });
}
