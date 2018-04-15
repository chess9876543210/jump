var player;
var gameend;
var gamestart;
var tiles;
var score;
var lasttile;
function setup() {
	createCanvas(800,800);
	score = 0;
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
		text("Game Over", 400, 400);
		text(lasttile, 400, 450);
		return;
	}
	if (gamestart) {
		score = 0;
		lasttile = 800 / 50 + 1;
		begintiles();
		background(color(128, 128, 0));
		player.effectPhysics();
		player.collides();
		player.draw();
		return;
	}
	background(color(255, 255, 0));
	player.addVel(new createVector(
		(mouseX - (player.pos.x + player.size.x/2)) / 40, 0)
	);
	player.effectPhysics();
	player.collides();
	deleteunneededtiles();
	if (player.pos.y > 300);
	
	for (var i = 0; i < tiles.length; i ++) {
		tiles[i].draw();
	}
	player.draw();
	text(lasttile, 400, 50);
}
function mousePressed() {
	if (gameend) {
		if (mouseButton == LEFT) {
			player.pos = new createVector(400, 10);
			gameend = false;
			gamestart = true;
			begintiles();
			return false;
		}
	}
	if (gamestart) {
		if (mouseButton == LEFT) {
			gamestart = false;
			score = 0;
			for (var i = 4; i >= 0; i --) {
				summontile(200*i);
			}
			return false;
		}
	}
	return true;
}
function player_function() {
	this.size = new createVector(30, 30);
	this.pos = new createVector(400 - this.size.x/2, 600 - this.size.y/2);
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
					(this.pos.y < tiles[i].pos.y + tiles[i].size.y + score) &&
					(this.pos.y + this.size.y > tiles[i].pos.y + score)
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
				if (this.vel.y > 0) {
				this.vel = new createVector(0, -12);
				this.pos.y = t.pos.y - this.size.y + score;
				score += 800 - t.pos.y - score;
				//summontile(- score);
				}
				return true;
			default: return false;
		}
	};
	this.effectPhysics = function() {
		var tmp_x = this.pos.x + this.vel.x;
		this.pos = new createVector(
			(tmp_x < -this.size.x/2 ? tmp_x + 800 :
				(tmp_x > 799 - this.size.x/2 ? tmp_x - 800 : tmp_x)
			), this.pos.y + this.vel.y);
		this.vel = new createVector(this.vel.x*0.8, this.vel.y*0.99 + 0.3);
		if (Math.abs(this.vel.x) < 1) {
			this.vel.x = 0;
		}
		if (this.pos.y > 800 - this.size.y) {
			gameend = true;
		}
	};
	this.draw = function() {
		fill(color(0));
		rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
	};
}
function tile(x, y, sx, sy, t) {
	this.pos = new createVector(x, y);
	this.size = new createVector(sx, sy);
	this.type = t;
	this.draw = function() {
		fill(color(0, 255, 0));
		rect(this.pos.x, this.pos.y + score, this.size.x, this.size.y);
	};
}
function begintiles() {
	tiles = [];
	for (var i = 0; i < 800 / 50; i ++) {
		tiles.push(new tile(10 + i * 50, 780, 30, 10, 1));
	}
}
function deleteunneededtiles() {
	for (var i = lasttile; i < tiles.length; i ++) {
		if (tiles[i].pos.y + score > 800) {
			lasttile ++;
			summontile(tiles[i].pos.y - 800);
		}
	}
}
function summontile(y) {
	tiles.push(new tile(15 + Math.random() * (width - 45), y, 30, 10, 1));
}