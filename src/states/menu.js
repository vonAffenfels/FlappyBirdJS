class MenuState extends Phaser.State {
	constructor() {
		super();
		this.menus = [];
	}

	create() {
		// Draw trees
		this.trees = new TreeGroupObject(this.game, this.game.config.get("trees.gap"), this.game.config.get("trees.speed"), this.game.config.get("trees.distance"));
		this.trees.start();

		// Draw ground
		this.ground = new GroundObject(this.game, this.game.config.get("trees.speed"));
		this.ground.start();

		// Draw title
		this.title = this.game.add.bitmapText(this.game.world.centerX, 128, "fnt_flappy", "Flappy Bird JS", 128);
		this.title.anchor.setTo(0.5);

		// Draw Highscore
		this.highscore = this.game.add.translatedBitmapText(this.game.world.centerX, 250, "fnt_flappy", "highscore", 48, 'left', {score: this.game.save.get("highscore")});
		this.highscore.anchor.setTo(0.5);

		this.menus[Game.Enums.Menus.MAIN] = new MainMenu(this.game, this);
		this.menus[Game.Enums.Menus.MAIN].draw();
		this.game.add.existing(this.menus[Game.Enums.Menus.MAIN]);

		this.menus[Game.Enums.Menus.COLOR_SELECT] = new ColorSelectMenu(this.game, this);
		this.menus[Game.Enums.Menus.COLOR_SELECT].draw();
		this.game.add.existing(this.menus[Game.Enums.Menus.COLOR_SELECT]);

		this.changeMenu(Game.Enums.Menus.MAIN);
	}

	update() {
		// Check if a tree is outside the drawing area (to the left)
		this.trees.checkVisibilty();

		// Handle input for menus
		this.menus[this.curMenu].handle();
	}

	changeMenu(id) {
		// Check if valid menu id
		if (id >= this.menus.length || id < 0) {
			return;
		}

		for (let i = 0; i < this.menus.length; i++) {
			this.menus[i].visible = false;
		}

		this.menus[id].visible = true;
		this.curMenu = id;
	}
}