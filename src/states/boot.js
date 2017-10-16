class BootState extends Phaser.State {
	constructor() {
		super();
	}

	preload() {
		this.game.load.image("loading","assets/images/loading.png"); 
	}

	create() {
		// set scale mode to cover the entire screen
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignVertically = true;
		this.scale.pageAlignHorizontally = true;

		// set a black color for the background of the stage
		this.game.stage.backgroundColor = "#000000";

		// start the Phaser arcade physics engine
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// set the gravity of the world
		this.game.physics.arcade.gravity.y = this.game.config.get("physics.gravity");

		// keep game running if it loses the focus
		this.game.stage.disableVisibilityChange = true;

		// Start loading stage
		this.game.state.start(Game.Enums.States.LOADING);
	}
}