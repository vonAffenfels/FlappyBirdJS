Game.objects.Ground = function (game, speed) {
	Phaser.TileSprite.call(this, game, 0, game.height - 100, game.width, 100, "img_ground");

	this.speed = speed;
	
	this.game.add.existing(this);
}

Game.objects.Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Game.objects.Ground.prototype.constructor = Game.objects.Ground;

Game.objects.Ground.prototype.start = function () {
	this.autoScroll(this.speed, 0);
}

Game.objects.Ground.prototype.stop = function () {
	this.autoScroll(0, 0);
}