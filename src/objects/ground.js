if (!Game) Game = {};
if (!Game.objects) Game.objects = {};

Game.objects.Ground = function (game, speed) {
	Phaser.TileSprite.call(this, game, 0, game.height - 100, game.width, 100, "img_ground");

	this.game.add.existing(this);
	this.autoScroll(speed, 0);
}

Game.objects.Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Game.objects.Ground.prototype.constructor = Game.objects.Ground;