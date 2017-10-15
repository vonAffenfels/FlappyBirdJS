Game.States.Menu = function (game) {
	Phaser.State.call(this);
	this.menus = [];
}

Game.States.Menu.prototype = Object.create(Phaser.State.prototype);
Game.States.Menu.prototype.constructor = Game.States.Menu;

Game.States.Menu.MENU_MAIN			= 0;
Game.States.Menu.MENU_COLOR_SELECT	= 1;

Game.States.Menu.prototype.create = function () {
	// Draw trees
	this.trees = new Game.Objects.TreeGroup(this.game, Game.config.trees.gap, Game.config.trees.speed, Game.config.trees.distance);
	this.trees.start();

	// Draw ground
	this.ground = new Game.Objects.Ground(this.game, Game.config.trees.speed);
	this.ground.start();

	// Draw title
	this.title = this.game.add.bitmapText(this.game.world.centerX, 128, "fnt_flappy", "Flappy Bird JS", 128);
	this.title.anchor.setTo(0.5);

	// Draw Highscore
	this.highscore = this.game.add.bitmapText(this.game.world.centerX, 250, "fnt_flappy", "Highscore: " + Game.save.highscore, 48);
	this.highscore.anchor.setTo(0.5);

	// Load main menu
	this.menus[Game.States.Menu.MENU_MAIN] = new Game.Menus.MainMenu(this.game, this);
	this.menus[Game.States.Menu.MENU_MAIN].draw();
	this.game.add.existing(this.menus[Game.States.Menu.MENU_MAIN]);

	// Load color select menu
	this.menus[Game.States.Menu.MENU_COLOR_SELECT] = new Game.Menus.ColorSelectMenu(this.game, this);
	this.menus[Game.States.Menu.MENU_COLOR_SELECT].draw();
	this.game.add.existing(this.menus[Game.States.Menu.MENU_COLOR_SELECT]);

	this.changeMenu(Game.States.Menu.MENU_MAIN);
};

Game.States.Menu.prototype.update = function () {
	// Check if a tree is outside the drawing area (to the left)
	this.trees.checkVisibilty();

	// Handle input for menus
	this.menus[this.curMenu].handle();
};

Game.States.Menu.prototype.changeMenu = function (id) {
	// Check if valid menu id
	if (id >= this.menus.length || id < 0) {
		return;
	}

	for (let i = 0; i < this.menus.length; i++) {
		this.menus[i].visible = false;
	}

	this.menus[id].visible = true;
	this.curMenu = id;
};