const MENU_MAIN 		= 0;
const MENU_COLOR_SELECT = 1;

Game.states.Menu = function (game) {
	this.menus = [];
}

Game.states.Menu.prototype = {
	create: function () {
		// Draw trees
		this.trees = new Game.objects.TreeGroup(this.game, Game.config.trees.gap, Game.config.trees.speed, Game.config.trees.distance);
		this.trees.start();

		// Draw ground
		this.ground = new Game.objects.Ground(this.game, Game.config.trees.speed);
		this.ground.start();

		// Draw title
		this.title = this.game.add.bitmapText(this.game.world.centerX, 128, "fnt_flappy", "Flappy Bird JS", 128);
		this.title.anchor.setTo(0.5);

		// Draw Highscore
		this.highscore = this.game.add.bitmapText(this.game.world.centerX, 250, "fnt_flappy", "Highscore: " + Game.save.highscore, 48);
		this.highscore.anchor.setTo(0.5);

		// Load main menu
		this.menus[MENU_MAIN] = new Game.menus.MainMenu(this.game, this);
		this.menus[MENU_MAIN].draw();
		this.game.add.existing(this.menus[MENU_MAIN]);

		// Load color select menu
		this.menus[MENU_COLOR_SELECT] = new Game.menus.ColorSelectMenu(this.game, this);
		this.menus[MENU_COLOR_SELECT].draw();
		this.game.add.existing(this.menus[MENU_COLOR_SELECT]);

		this.changeMenu(MENU_MAIN);
	},

	update: function () {
		// Check if a tree is outside the drawing area (to the left)
		this.trees.checkVisibilty();

		// Handle input for menus
		this.menus[this.curMenu].handle();
	},

	changeMenu: function (id) {
		// Check if valid menu id
		if (id >= this.menus.length || id < 0) {
			return;
		}

		for (let i = 0; i < this.menus.length; i++) {
			this.menus[i].visible = false;
		}

		this.menus[id].visible = true;
		this.curMenu = id;
	},
}