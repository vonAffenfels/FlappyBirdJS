Game.Objects.TreeGroup = function (game, gap, speed, distance) {
	Phaser.Group.call(this, game);

	this.distance = distance;

	// Calculate number of trees needed
	// Ceil(Width / (Width_Tree + Distance) + 1)
	this.numTrees = Math.ceil(this.game.world.width / (90 + distance)) + 1;

	for (let i = 0; i < this.numTrees; i++) {
		let tree = new Game.Objects.Tree(this.game, this, i, gap, speed);
		tree.restart(this.game.world.width + i * this.distance);
	}

	this.firstTree = this.getAt(0);
	this.lastTree = this.getAt(this.length - 1);
	this.currentTree = this.firstTree;
}

Game.Objects.TreeGroup.prototype = Object.create(Phaser.Group.prototype);
Game.Objects.TreeGroup.prototype.constructor = Game.Objects.TreeGroup;

Game.Objects.TreeGroup.prototype.checkVisibilty = function () {
	if (this.firstTree.getWorldX() < -this.firstTree.width) {
		// Tree is out of screen
		this.firstTree.restart(this.lastTree.getWorldX() + this.distance);

		this.firstTree = this._getNextTree(this.firstTree.index);
		this.lastTree = this._getNextTree(this.lastTree.index);
	}
}

Game.Objects.TreeGroup.prototype._getNextTree = function (index) {
	return this.getAt((index + 1) % this.length);
}

Game.Objects.TreeGroup.prototype.start = function () {
	for (let i = 0; i < this.numTrees; i++) {
		this.getAt(i).start();
	}
}

Game.Objects.TreeGroup.prototype.stop = function () {
	for (let i = 0; i < this.numTrees; i++) {
		this.getAt(i).stop();
	}
}

Game.Objects.TreeGroup.prototype.isColliding = function (bird) {
	return this.game.physics.arcade.collide(bird, this.currentTree);
}

Game.Objects.TreeGroup.prototype.activateNextTree = function () {
	this.currentTree = this._getNextTree(this.currentTree.index);
}

Game.Objects.TreeGroup.prototype.hasPassed = function (bird) {
	return bird.x > this.currentTree.getGapX();
}