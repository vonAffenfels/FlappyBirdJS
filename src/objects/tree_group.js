if (!Game) Game = {};
if (!Game.objects) Game.objects = {};

Game.objects.TreeGroup = function (game, gap, speed, distance) {
	Phaser.Group.call(this, game);

	this.distance = distance;

	// Calculate number of trees needed
	// Ceil(Width / (Width_Tree + Distance) + 1)
	this.numTrees = Math.ceil(this.game.world.width / (90 + distance)) + 1;

	for (let i = 0; i < this.numTrees; i++) {
		let tree = new Game.objects.Tree(this.game, this, i, gap, speed);
		tree.restart(this.game.world.width + i * this.distance);
	}

	this.firstTree = this.getAt(0);
	this.lastTree = this.getAt(this.length - 1);
	this.currentTree = this.firstTree;
}

Game.objects.TreeGroup.prototype = Object.create(Phaser.Group.prototype);
Game.objects.TreeGroup.prototype.constructor = Game.objects.TreeGroup;

Game.objects.TreeGroup.prototype.checkVisibilty = function () {
	if (this.firstTree.getWorldX() < -this.firstTree.width) {
		// Tree is out of screen
		this.firstTree.restart(this.lastTree.getWorldX() + this.distance);

		this.firstTree = this._getNextTree(this.firstTree.index);
		this.lastTree = this._getNextTree(this.lastTree.index);
	}
}

Game.objects.TreeGroup.prototype._getNextTree = function (index) {
	return this.getAt((index + 1) % this.length);
}

Game.objects.TreeGroup.prototype.start = function () {
	for (let i = 0; i < this.numTrees; i++) {
		this.getAt(i).start();
	}
}

Game.objects.TreeGroup.prototype.stop = function () {
	for (let i = 0; i < this.numTrees; i++) {
		this.getAt(i).stop();
	}
}

Game.objects.TreeGroup.prototype.isColliding = function (bird) {
	return this.game.physics.arcade.collide(bird, this.currentTree);
}

Game.objects.TreeGroup.prototype.activateNextTree = function () {
	this.currentTree = this._getNextTree(this.currentTree.index);
}