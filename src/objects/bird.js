if (!Game) Game = {};
if (!Game.objects) Game.objects = {};

Game.objects.Bird = function (game, x, y) {
	Phaser.Sprite.call(this, game, x, y, "img_bird");

	this.game.physics.arcade.enableBody(this);
	this.body.moves = false;
	this.body.immovable = true;

	this.animations.add("flap", [Game.save.selectedColor * 2, Game.save.selectedColor * 2 + 1])
	this.frame = Game.save.selectedColor * 2;

	this.game.add.existing(this);
}

Game.objects.Bird.prototype = Object.create(Phaser.Sprite.prototype);
Game.objects.Bird.prototype.constructor = Game.objects.Bird;

Game.objects.Bird.prototype.start = function () {
	this.animations.play("flap", 8, true);
	this.body.moves = true;
	this.body.immovable = false;
}

Game.objects.Bird.prototype.stop = function () {
	this.animations.stop("flap", true);
	this.body.moves = false;
	this.body.immovable = true;
}

Game.objects.Bird.prototype.flap = function() {
	this.body.velocity.y = Game.config.physics.flapForce;
}