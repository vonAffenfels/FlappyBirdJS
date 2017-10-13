if (!Game) Game = {};
if (!Game.objects) Game.objects = {};

Game.objects.TreeGroup = function (game, gap, speed, distance) {
	Phaser.Group.call(this, game);

	this.distance = distance;

	// Calculate number of trees needed
	// Ceil(Width / (Width_Tree + Distance) + 1)
	let numTrees = Math.ceil(this.game.world.width / (90 + distance)) + 1;

	for (let i = 0; i < numTrees; i++) {
		let tree = new Game.objects.Tree(this.game, this, i, gap, speed);
		tree.restart(this.game.world.width + (i + 1) * this.distance);
	}

	this.firstTree = this.getAt(0);
	this.lastTree = this.getAt(this.length - 1);
}

Game.objects.TreeGroup.prototype = Object.create(Phaser.Group.prototype);
Game.objects.TreeGroup.prototype.constructor = Game.objects.TreeGroup;

Game.objects.TreeGroup.prototype.checkVisibilty = function () {
	if (this.firstTree.getWorldX() < -this.firstTree.width) {
		// Tree is out of screen
		this.firstTree.restart(this.lastTree.getWorldX() + this.distance);

		this.firstTree = this.getNextTree(this.firstTree.index);
		this.lastTree = this.getNextTree(this.lastTree.index);
	}
}

Game.objects.TreeGroup.prototype.getNextTree = function (index) {
	return this.getAt((index + 1) % this.length);
}