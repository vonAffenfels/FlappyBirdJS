Game.Objects.Bird = function (game, x, y) {
	Phaser.Sprite.call(this, game, x, y, "img_bird");

	this.game.physics.arcade.enableBody(this);
	this.body.moves = false;
	this.body.immovable = true;
	this.baseFrame = Game.save.selectedColor * 2;

	this.animations.add("flap", [this.baseFrame, this.baseFrame + 1]);
	this.frame = Game.save.selectedColor * 2;

	this.game.add.existing(this);
}

Game.Objects.Bird.prototype = Object.create(Phaser.Sprite.prototype);
Game.Objects.Bird.prototype.constructor = Game.Objects.Bird;

Game.Objects.Bird.prototype.start = function () {
	this.animations.play("flap", 8, true);
	this.body.moves = true;
	this.body.immovable = false;
}

Game.Objects.Bird.prototype.stop = function () {
	this.animations.stop("flap", true);
	this.frame = this.baseFrame;
	this.body.moves = false;
	this.body.immovable = true;
}

Game.Objects.Bird.prototype.flap = function() {
	this.body.velocity.y = Game.config.physics.flapForce;
}