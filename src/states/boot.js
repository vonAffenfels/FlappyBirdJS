if (!Game) Game = {};
if (!Game.states) Game.states = {};

Game.states.boot = function (game) {}

Game.states.boot.prototype = {
	preload: function(){
          this.game.load.image("loading","assets/loading.png"); 
	},

	create: function () {
		// set scale mode to cover the entire screen
		this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		this.scale.pageAlignVertically = true;
		this.scale.pageAlignHorizontally = true;

		// set a black color for the background of the stage
		this.game.stage.backgroundColor = "#000000";

		// start the Phaser arcade physics engine
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// set the gravity of the world
		this.game.physics.arcade.gravity.y = 1300;

		// Start loading stage
		this.game.state.start("loading");
	}
}