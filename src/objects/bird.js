class BirdObject extends Phaser.Sprite {
	constructor(game, x, y) {
		super(game, x, y, "img_bird");

		this.game.physics.arcade.enableBody(this);
		this.body.moves = false;
		this.body.immovable = true;
		this.baseFrame = this.game.save.get("selectedColor") * 2;

		this.animations.add("flap", [this.baseFrame, this.baseFrame + 1]);
		this.frame = this.baseFrame;

		this.game.add.existing(this);
	}

	start() {
		this.animations.play("flap", 8, true);
		this.body.moves = true;
		this.body.immovable = false;
	}

	stop() {
		this.animations.stop("flap", true);
		this.frame = this.baseFrame;
		this.body.moves = false;
		this.body.immovable = true;
	}

	flap() {
		this.body.velocity.y = this.game.config.get("physics.flapForce");
	}
}