import Phaser from 'phaser';

export default class GroundObject extends Phaser.TileSprite {
	constructor(game, speed) {
		super(game, 0, game.height - 50, game.width, 50, "img_ground");

		this.speed = speed;
	}

	start() {
		this.autoScroll(this.speed, 0);
	}

	stop() {
		this.autoScroll(0, 0);
	} 
}