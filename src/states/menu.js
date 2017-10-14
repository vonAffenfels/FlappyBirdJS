if (!Game) Game = {};
if (!Game.states) Game.states = {};

const MENU_MAIN 		= 0;
const MENU_COLOR_SELECT = 1;

Game.states.Menu = function (game) {
	this.menus = [];
	this.menus[MENU_MAIN] = new Game.menus.MainMenu(game, this);
}

Game.states.Menu.prototype = {
	create: function () {
		// Draw trees
		this.trees = new Game.objects.TreeGroup(this.game, Game.config.trees.gap, Game.config.trees.speed, Game.config.trees.distance);

		// Draw ground
		this.ground = new Game.objects.Ground(this.game, Game.config.trees.speed);

		// Draw title
		this.title = this.game.add.bitmapText(this.game.world.centerX, 128, "fnt_flappy", "Flappy Bird JS", 128);
		this.title.anchor.setTo(0.5, 0.5);

		for (let i = 0; i < this.menus.length; i++) {
			this.menus[i].draw();
			this.game.add.existing(this.menus[i]);
		}

		this.changeMenu(MENU_MAIN);
	},

	update: function () {
		// Check if a tree is outside the drawing area (to the left)
		this.trees.checkVisibilty();

		// Handle input for menus
		this.menus[this.curMenu].handle();
	},

	_colorSelectMenuDraw: function () {
		this.menuGroups[this.MENU_COLOR_SELECT] = this.game.add.group();
		this.menuGroups[this.MENU_COLOR_SELECT].visible = false;
		this.menuGroups[this.MENU_COLOR_SELECT].positions = [];

		let numColors = Game.config.availableColors;

		let itemSize = 36 + 36; // Image width + spacer
		let menuWidth = numColors * itemSize - 36;
		let curX = -(menuWidth / 2);

		for (let i = 0; i < numColors; i++) {
			let posX = Math.floor(this.game.world.centerX + curX + itemSize * i);

			let bird = this.game.add.sprite(posX, this.game.world.centerY, "img_bird", i * 2, this.menuGroups[this.MENU_COLOR_SELECT]);
			bird.anchor.set(0.5);
			bird.animations.add("flap", [i * 2, i * 2 + 1]);
			bird.animations.play("flap", 8, true);

			this.menuGroups[this.MENU_COLOR_SELECT].positions[i] = {
				x: posX,
				y: this.game.world.centerY + 36 + 18
			};
		}

		// Selector char
		let selectorPos = this.menuGroups[this.MENU_COLOR_SELECT].positions[this.selectedItem]
		let selector = this.game.add.bitmapText(selectorPos.x, selectorPos.y, "fnt_flappy", "^", 36 + 18, this.menuGroups[this.MENU_COLOR_SELECT]);
		selector.name = "selector";
		selector.anchor.setTo(0.5);
	},

	_colorSelectMenuUpdate: function () {
		if (!this.menuGroups[this.MENU_COLOR_SELECT].visible) {
			return;
		}

		let cursors = this.game.input.keyboard.createCursorKeys();
		let keySpace = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		let keyEnter = this.game.input.keyboard.addKey(Phaser.KeyCode.ENTER);

		if (cursors.right.justPressed()) {
			this.selectedItem = Math.min(Game.config.availableColors - 1, this.selectedItem + 1);
		} else if (cursors.left.justPressed()) {
			this.selectedItem = Math.max(0, this.selectedItem - 1);
		} else if (keySpace.justPressed() || keyEnter.justPressed()) {
			Game.save.selectedColor = this.selectedItem;

			// Update main menu selector
			let selectorBird = this.menuGroups[this.MENU_MAIN].getByName("selector");
			selectorBird.animations.add("flap", [Game.save.selectedColor * 2, Game.save.selectedColor * 2 + 1]);
			selectorBird.animations.play("flap", 8, true);

			this._selectMenu(this.MENU_MAIN);
		}

		let selectorPos = this.menuGroups[this.MENU_COLOR_SELECT].positions[this.selectedItem]
		let selector = this.menuGroups[this.MENU_COLOR_SELECT].getByName("selector");
		selector.x = selectorPos.x;
		selector.y = selectorPos.y;
	},

	changeMenu: function (id) {
		for (let i = 0; i < this.menus.length; i++) {
			this.menus[i].visible = false;
		}

		this.menus[id].visible = true;
		this.curMenu = id;
	},
}