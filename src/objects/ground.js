class GroundObject extends Phaser.TileSprite {
	constructor(game, speed) {
		super(game, 0, game.height - 100, game.width, 100, "img_ground");

		this.speed = speed;
		this.game.add.existing(this);
	}

	start() {
		this.autoScroll(this.speed, 0);
	}

	stop() {
		this.autoScroll(0, 0);
	}
}