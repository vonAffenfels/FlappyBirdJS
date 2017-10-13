if (!Game) Game = {};
if (!Game.states) Game.states = {};

Game.states.Menu = function (game) {
	this.MENU_MAIN = 0;
	this.MENU_COLOR_SELECT = 1;

	this.mainMenu = [
		{
			text: "Start",
			posX: 0,
			posY: 0
		},
		{
			text: "Farbwahl",
			posX: 0,
			posY: 0
		}
	];

	this.currentMenu = this.MENU_MAIN;
	this.selectedItem = 0;
}

Game.states.Menu.prototype = {
	create: function () {
		// Draw trees
		this.trees = new Game.objects.TreeGroup(this.game, Game.config.trees.gap, Game.config.trees.speed, Game.config.trees.distance);

		// Draw ground
		this.ground = new Game.objects.Ground(this.game, Game.config.trees.speed);

		// Draw a translucent background
		let bg = this.game.add.graphics(0, 0);
		bg.beginFill(0x000000, 0.3);
		bg.drawRect(0, 0, this.game.world.width, this.game.world.height);
		bg.endFill();

		let title = this.game.add.bitmapText(this.game.world.centerX, 128, "fnt_flappy", "Flappy Bird JS", 128);
		title.anchor.setTo(0.5, 0.5);
		
		switch (this.currentMenu) {
			case this.MENU_MAIN:
				this._mainMenuDraw();
				break;
		}
	},

	update: function () {
		// Check if a tree is outside the drawing area (to the left)
		this.trees.checkVisibilty();

		switch (this.currentMenu) {
			case this.MENU_MAIN:
				this._mainMenuUpdate();
				break;
		}
	},

	_mainMenuDraw: function() {
		let itemSize = 64 + 16;
		let menuHeight = this.mainMenu.length * itemSize - 16; // Remove last space
		let curY = -(menuHeight / 2);
		let selectorY = 0;
		let selectorX = this.game.world.centerX;

		for (let i = 0; i < this.mainMenu.length; i++) {
			let text = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 64 + curY + (menuHeight / 2) * i, "fnt_flappy", this.mainMenu[i].text, 64);
			text.anchor.setTo(0.5);

			this.mainMenu[i].posX = text.centerX - text.width / 2 - 16;
			this.mainMenu[i].posY = this.game.world.centerY + 64 + curY + (menuHeight / 2) * i;
		}

		// Selector bird
		this.selector = this.game.add.sprite(this.mainMenu[this.selectedItem].posX, this.mainMenu[this.selectedItem].posY, "img_bird");
		this.selector.animations.add("flap", [0, 1]);
		this.selector.animations.play("flap", 8, true);
		this.selector.anchor.set(1, 0.6);
		this.selector.scale.setTo(1.2);
	},

	_mainMenuUpdate: function () {
		let cursors = this.game.input.keyboard.createCursorKeys();
		if (cursors.down.justPressed()) {
			this.selectedItem = Math.min(this.mainMenu.length - 1, this.selectedItem + 1);
		} else if (cursors.up.justPressed()) {
			this.selectedItem = Math.max(0, this.selectedItem - 1);
		}

		this.selector.x = this.mainMenu[this.selectedItem].posX;
		this.selector.y = this.mainMenu[this.selectedItem].posY;
	}
}