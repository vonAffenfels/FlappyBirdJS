Game.States.Boot = function (game) {
	Phaser.State.call(this);
}

Game.States.Boot.prototype = Object.create(Phaser.State.prototype);
Game.States.Boot.prototype.constructor = Game.States.Boot;

Game.States.Boot.prototype.preload = function() {
	this.game.load.image("loading","assets/images/loading.png"); 
};

Game.States.Boot.prototype.create = function() {
	// set scale mode to cover the entire screen
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.pageAlignVertically = true;
	this.scale.pageAlignHorizontally = true;

	// set a black color for the background of the stage
	this.game.stage.backgroundColor = "#000000";

	// start the Phaser arcade physics engine
	this.game.physics.startSystem(Phaser.Physics.ARCADE);

	// set the gravity of the world
	this.game.physics.arcade.gravity.y = Game.config.physics.gravity;

	// keep game running if it loses the focus
	this.game.stage.disableVisibilityChange = true;

	// Start loading stage
	this.game.state.start("loading");
}