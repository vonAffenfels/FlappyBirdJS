Game.Objects.Tree = function (game, parent, index, gap, speed) {
	Phaser.Group.call(this, game, parent);

	this.index = index;
	this.speed = speed;

	this.topTree = new Phaser.Sprite(this.game, 0, 0, "img_tree", 0);
	this.bottomTree = new Phaser.Sprite(this.game, 0, 0, "img_tree", 1);

	this.game.physics.arcade.enableBody(this.topTree);
	this.game.physics.arcade.enableBody(this.bottomTree);
	
	this.topTree.body.allowGravity = false;
	this.topTree.body.immovable = true;
	this.bottomTree.body.allowGravity = false;
	this.bottomTree.body.immovable = true;
	
	this.add(this.topTree);
	this.add(this.bottomTree);

	this.gap = Math.min(this.game.world.height - 320, gap);

	this.topMin = 110 - this.topTree.height;
	this.topMax = this.game.world.height - this.topTree.height - this.gap - 210;
	this.running = false;
}

Game.Objects.Tree.prototype = Object.create(Phaser.Group.prototype);
Game.Objects.Tree.prototype.constructor = Game.Objects.Tree;

Game.Objects.Tree.prototype.restart = function (x) {
	this.topTree.reset(0, 0);

	this.bottomTree.reset(0, this.topTree.height + this.gap);

	this.x = x;
	this.y = this.game.rnd.integerInRange(this.topMin, this.topMax);

	if (this.running) {
		this.setAll("body.velocity.x", this.speed);
	}
}

Game.Objects.Tree.prototype.getWorldX = function () {
	return this.topTree.world.x;
}

Game.Objects.Tree.prototype.start = function () {
	this.setAll("body.velocity.x", this.speed);
	this.running = true;
}

Game.Objects.Tree.prototype.stop = function () {
	this.setAll("body.velocity.x", 0);
	this.running = false;
}

Game.Objects.Tree.prototype.getGapX = function () {
	return this.bottomTree.world.x + this.bottomTree.width;
}