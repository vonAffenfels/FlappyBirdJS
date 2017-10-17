import Phaser from 'phaser';

import TreeObject from './tree';

export default class TreeGroupObject extends Phaser.Group {
	constructor(game, gap, speed, distance) {
		super(game);

		this.distance = distance;

		// Calculate number of trees needed
		// Ceil(Width / (Width_Tree + Distance) + 1)
		this.numTrees = Math.ceil(this.game.world.width / (90 + distance)) + 1;

		for (let i = 0; i < this.numTrees; i++) {
			let tree = new TreeObject(this.game, this, i, gap, speed);
			tree.restart(this.game.world.width + i * this.distance);
		}

		this.firstTree = this.getAt(0);
		this.lastTree = this.getAt(this.length - 1);
		this.currentTree = this.firstTree;
	}

	checkVisibilty() {
		if (this.firstTree.getWorldX() < -this.firstTree.width) {
			// Tree is out of screen
			this.firstTree.restart(this.lastTree.getWorldX() + this.distance);

			this.firstTree = this._getNextTree(this.firstTree.index);
			this.lastTree = this._getNextTree(this.lastTree.index);
		}
	}

	_getNextTree(index) {
		return this.getAt((index + 1) % this.length);
	}

	start() {
		for (let i = 0; i < this.numTrees; i++) {
			this.getAt(i).start();
		}
	}

	stop() {
		for (let i = 0; i < this.numTrees; i++) {
			this.getAt(i).stop();
		}
	}

	isColliding(bird) {
		return this.game.physics.arcade.collide(bird, this.currentTree);
	}

	activateNextTree() {
		this.currentTree = this._getNextTree(this.currentTree.index);
	}

	hasPassed(bird) {
		return bird.x > this.currentTree.getGapX();
	}
}