var player;
var gameend;
var gamestart;
var tiles;
var offset;
var supposedoffset;
var score;
var gamewidth = 800;
var gameheight = 800;
var mouseUsed = true;
var keyboardDir = 0;
function setup() {
	createCanvas(gamewidth, gameheight);
	score = gamewidth / 50 + 1;
	offset = 0;
	supposedoffset = 0;
	gameend = true;
	gamestart = true;
	player = new player_function();
	begintiles();
}
function draw() {
	if (gameend) {
		background(color(0,0,0));
		fill(color(255, 255, 255));
		stroke(color(255, 255, 255));
		textAlign(CENTER, CENTER);
		text("Game Over", gamewidth/2, gameheight/2);
		text(score - (gamewidth/50), gamewidth/2, 5*gameheight/8);
		return;
	}
	if (gamestart) {
		offset = 0;
		supposedoffset = 0;
		score = gamewidth / 50 + 1;
		begintiles();
		background(color(128, 128, 0));
		player.effectPhysics();
		player.collides();
		player.draw();
		return;
	}
	background(color(255, 255, 0));
	if (mouseUsed) {
		mouseMovePlayer();
	} else {
		keyboardMovePlayer();
	}
	player.effectPhysics();
	player.collides();
	deleteunneededtiles();
	if (offset < supposedoffset) {
		offset += (supposedoffset - offset)*0.1;
	}
	
	for (var i = 0; i < tiles.length; i ++) {
		tiles[i].draw();
	}
	player.draw();
	text(score - (gamewidth/50), gamewidth/2, 50);
}
function mouseMovePlayer() {
	player.addVel(new createVector(
		(mouseX - (player.pos.x + player.size.x/2)) / 40, 0)
	);
}
function keyboardMovePlayer() {
	player.addVel(new createVector(keyboardDir, 0));
}
function keyPressed() {
	switch (keyCode) {
		case LEFT_ARROW:
			keyboardDir = -3;
			mouseUsed = false;
			break;
		case RIGHT_ARROW:
			keyboardDir = 3;
			mouseUsed = false;
		case UP_ARROW:
		case DOWN_ARROW:
			if (gameend) {
				player.pos = new createVector(gamewidth/2, 10);
				gameend = false;
				gamestart = true;
				begintiles();
			}
			if (gamestart) {
				gamestart = false;
				offset = 0;
				supposedoffset = 0;
				for (var i = 4; i >= 0; i --) {
					summontile(gameheight/4*i);
				}
			}
			mouseUsed = false;
			break;		
	}
}
function mousePressed() {
	if (gameend) {
		if (mouseButton == LEFT) {
			player.pos = new createVector(gamewidth/2, 10);
			gameend = false;
			gamestart = true;
			begintiles();
			mouseUsed = true;
			return false;
		}
	}
	if (gamestart) {
		if (mouseButton == LEFT) {
			gamestart = false;
			offset = 0;
			supposedoffset = 0;
			for (var i = 4; i >= 0; i --) {
				summontile(gameheight/4*i);
			}
			mouseUsed = true;
			return false;
		}
	}
	return true;
}
function player_function() {
	this.size = new createVector(30, 30);
	this.pos = new createVector(gamewidth/2 - this.size.x/2, 3*gameheight/4 - this.size.y/2);
	this.vel = new createVector(0, 0);
	this.addVel = function(v) {
		this.vel = new createVector(this.vel.x + v.x, this.vel.y + v.y);
		if (Math.abs(this.vel.x) > 12) {
			this.vel = new createVector((this.vel.x > 0 ? 12 : -12), this.vel.y);
		}
	};
	this.collides = function() {
		for (var i = 0; i < tiles.length; i ++) {
			if (
				(
					(this.pos.x < tiles[i].pos.x + tiles[i].size.x) &&
					(this.pos.x + this.size.x > tiles[i].pos.x)
				) && (
					(this.pos.y < tiles[i].pos.y + tiles[i].size.y) &&
					(this.pos.y + this.size.y > tiles[i].pos.y)
				)
			) {
				if (!this.collide(tiles[i])) {
					throw new Error("unknown tile type: " + tiles[i].type);
				}
			}
		}
	};
	this.collide = function(t) {
		switch (t.type) {
			case 1:
				if (this.vel.y > 0 && t.pos.y + t.size.y + offset > this.pos.y + offset) { //player base is above tile and falling
				this.vel = new createVector(0, -12);
				this.pos.y = t.pos.y - this.size.y;
				if (gameheight - t.pos.y - offset > 0)
					addoffset(gameheight - t.pos.y - offset);
				}
				return true;
			default: return false;
		}
	};
	this.effectPhysics = function() {
		var tmp_x = this.pos.x + this.vel.x;
		this.pos = new createVector(
			(tmp_x < -this.size.x/2 ? tmp_x + gamewidth :
				(tmp_x > gamewidth - 1 - this.size.x/2 ? tmp_x - gamewidth : tmp_x)
			), this.pos.y + this.vel.y);
		this.vel = new createVector(this.vel.x*0.8, this.vel.y*0.99 + 0.3);
		if (Math.abs(this.vel.x) < 1) {
			this.vel.x = 0;
		}
		if (this.pos.y + offset - gameheight/4 > gameheight - this.size.y) {
			gameend = true;
		}
	};
	this.draw = function() {
		fill(color(0));
		rect(this.pos.x, this.pos.y + offset - gameheight/4, this.size.x, this.size.y);
	};
}
function tile(x, y, sx, sy, t) {
	this.pos = new createVector(x, y);
	this.size = new createVector(sx, sy);
	this.type = t;
	this.draw = function() {
		fill(color(0, 255, 0));
		rect(this.pos.x, this.pos.y + offset - gameheight/4, this.size.x, this.size.y);
	};
}
function begintiles() {
	tiles = [];
	for (var i = 0; i < gamewidth / 50; i ++) {
		tiles.push(new tile(10 + i * 50, gameheight - 20, 30, 10, 1));
	}
}
function deleteunneededtiles() { //does not actually delete, just renders elements unused
	for (var i = score; i < tiles.length; i ++) {
		if (tiles[i].pos.y + offset > gameheight) {
			score ++;
			summontile(tiles[i].pos.y - gameheight);
		}
	}
}
function summontile(y) {
	tiles.push(new tile(15 + Math.random() * (width - 45), y, 30, 10, 1));
}
function addoffset(num) {
	supposedoffset = offset + num;
}
