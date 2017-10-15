Game.Objects.Ground = function (game, speed) {
	Phaser.TileSprite.call(this, game, 0, game.height - 100, game.width, 100, "img_ground");

	this.speed = speed;
	
	this.game.add.existing(this);
}

Game.Objects.Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Game.Objects.Ground.prototype.constructor = Game.Objects.Ground;

Game.Objects.Ground.prototype.start = function () {
	this.autoScroll(this.speed, 0);
}

Game.Objects.Ground.prototype.stop = function () {
	this.autoScroll(0, 0);
}