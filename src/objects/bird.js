import Phaser from 'phaser'; 

export default class BirdObject extends Phaser.Sprite {
	constructor(game, x, y) {
		super(game, x, y, "img_bird");

		this.game.physics.arcade.enableBody(this);
		this.body.moves = false;
		this.body.immovable = true;
		this.baseFrame = this.game.save.get("selectedColor") * 2;

		this.animations.add("flap", [this.baseFrame, this.baseFrame + 1]);
		this.frame = this.baseFrame;

		this.pewAudio = this.game.add.audio("snd_pew");
		this.isFlapping = false;
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
		if (this.isFlapping) {
			return;
		}

		this.isFlapping = true;
		this.body.velocity.y = this.game.config.get("physics.flapForce");
		this.pewAudio.play();
		this.isFlapping = false;
	}

	update() {
		let vel = this.body.velocity.y;
		let gravity = this.game.config.get("physics.gravity");
		let flapForce = this.game.config.get("physics.flapForce");
		
		let angle = 0;
		if (vel > 0) {
			angle = this._map(vel, 0, gravity, 0, 45);
		} else if (vel < 0) {
			angle = this._map(vel, flapForce, 0, -22, 0);
		}

		this.angle = angle;
	}	

	_map(x, in_min, in_max, out_min, out_max) {
		return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}
}