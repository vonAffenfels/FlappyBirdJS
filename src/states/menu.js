import Phaser from 'phaser';

import Enums from '../enums';

// Objects
import TreeGroupObject from '../objects/tree_group';
import GroundObject from '../objects/ground';

// Menus
import MainMenu from '../menus/main';
import ColorSelectMenu from '../menus/color_select';

export class MenuState extends Phaser.State {
	constructor() {
		super();
		this.menus = [];
	}

	create() {
		let centerX = this.game.world.centerX;
		let config 	= this.game.config;

		// Draw trees
		this.trees = new TreeGroupObject(this.game, config.get("trees.gap"), config.get("trees.speed"), config.get("trees.distance"));
		this.trees.start();
		this.game.add.existing(this.trees);
 
		// Draw ground
		this.ground = new GroundObject(this.game, config.get("trees.speed"));
		this.ground.start();
		this.game.add.existing(this.ground);

		// Draw title
		this.title = this.game.add.translatedBitmapText(centerX, 96, "fnt_flappy", "title", config.get("fontSize.title"));
		this.title.anchor.setTo(0.5);

		// Draw Highscore
		this.highscore = this.game.add.translatedBitmapText(centerX, 150, "fnt_flappy", "highscore", config.get("fontSize.menu"), 'left', {score: this.game.save.get("highscore")});
		this.highscore.anchor.setTo(0.5);

		this.menus[Enums.Menus.MAIN] = new MainMenu(this.game, this);
		this.menus[Enums.Menus.MAIN].draw();
		this.game.add.existing(this.menus[Enums.Menus.MAIN]);

		this.menus[Enums.Menus.COLOR_SELECT] = new ColorSelectMenu(this.game, this);
		this.menus[Enums.Menus.COLOR_SELECT].draw();
		this.game.add.existing(this.menus[Enums.Menus.COLOR_SELECT]);

		this.changeMenu(Enums.Menus.MAIN);
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