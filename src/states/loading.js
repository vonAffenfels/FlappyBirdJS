Game.States.Loading = function (game) {
	Phaser.State.call(this);
}

Game.States.Loading.prototype = Object.create(Phaser.State.prototype);
Game.States.Loading.prototype.constructor = Game.States.Loading;

Game.States.Loading.prototype.preload = function () {
    let loadingBar = this.add.sprite(this.world.centerX, this.world.centerY, "loading");
    loadingBar.anchor.setTo(0.5,0.5);
    this.load.setPreloadSprite(loadingBar);
    
	this.game.load.spritesheet("img_bird", "assets/images/img_bird.png", 36, 36, 20);
	this.game.load.spritesheet("img_tree", "assets/images/img_tree.png", 90, 400, 2);

	this.game.load.image("img_ground", "assets/images/img_ground.png");

	this.load.bitmapFont("fnt_flappy", 'assets/fonts/fnt_flappy.png', 'assets/fonts/fnt_flappy.fnt');

	// Load game states
	Game.loadState();
}

Game.States.Loading.prototype.create = function () {
	// set a blue color for the background of the stage
	this.game.stage.backgroundColor = "#89bfdc";

	this.game.state.start("menu");
}