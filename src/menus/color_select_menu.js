if (!Game) Game = {};
if (!Game.menus) Game.menus = {};

Game.menus.ColorSelectMenu = function (game, state) {
	Phaser.Group.call(this, game);

	this.state = state;
	this.visible = false;
	this.curSel = Game.save.selectedColor;

	this.items = [];

	for (let i = 0; i < Game.config.availableColors; i++) {
		this.items.push({
			sprite: "img_bird",
			frame: i * 2,
			action: function () {
				console.log("SELECTED COLOR " + i);
			}
		});
	}

	this.imgWidth = 36;
	this.scl = 1;
	this.sclHighlight = 1.5;
	this.selectorSpace = 16;
}

Game.menus.ColorSelectMenu.prototype = Object.create(Phaser.Group.prototype);
Game.menus.ColorSelectMenu.prototype.constructor = Game.menus.ColorSelectMenu;

// Draw the menu
Game.menus.ColorSelectMenu.prototype.draw = function () {
	let space = 36;

	// Calculate width of whole menu
	let menuWidth = this.items.length * (this.imgWidth + space) - space;

	// Calculate left most position
	let baseY = this.game.world.centerX - (menuWidth / 2);

	for (let i = 0; i < this.items.length; i++) {
		let posX = Math.floor(baseY + (this.imgWidth + space) * i);
		let shouldHighlight = (i == this.curSel && !Phaser.Device.touch);

		this.items[i].obj = this.game.add.sprite(posX, this.game.world.centerY, "img_bird", i * 2, this);
		this.items[i].obj.scale.setTo(shouldHighlight ? this.sclHighlight : this.scl);
		this.items[i].obj.anchor.set(0.5);
		this.items[i].obj.animations.add("anim", [this.items[i].frame, this.items[i].frame + 1]);
		this.items[i].obj.animations.play("anim", 8, true);
		this.items[i].obj.inputEnabled = true;
		this.items[i].obj.events.onInputOver.add(function () {
			this._setSelected(i);
		}, this);
		this.items[i].obj.events.onInputDown.add(function () {
			this._setColor(i);
		}, this);
		this.items[i].x = posX;
	}

	// Selector char
	let y = Math.floor(this.items[this.curSel].obj.centerY + this.items[this.curSel].obj.height + this.selectorSpace);
	this.selector = this.game.add.bitmapText(this.items[this.curSel].x, y, "fnt_flappy", "^", 36 + 18, this);
	this.selector.anchor.setTo(0.5);
	this.selector.visible = !Phaser.Device.touch;
}

// Handle updates
Game.menus.ColorSelectMenu.prototype.handle = function () {
	let oldSel = this.curSel;
	let cursors = this.game.input.keyboard.createCursorKeys();
	let keySpace = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

	if (cursors.right.justPressed()) {
		this._setSelected(Math.min(this.items.length - 1, this.curSel + 1));
	} else if (cursors.left.justPressed()) {
		this._setSelected(Math.max(0, this.curSel - 1));
	} else if (keySpace.justPressed()) {
		this._setColor(this.curSel);
	}
}

Game.menus.ColorSelectMenu.prototype._setColor = function (color) {
	Game.save.selectedColor = color;
	Game.saveState();
	this.state.changeMenu(MENU_MAIN);
}

// Set new selected menuitem
Game.menus.ColorSelectMenu.prototype._setSelected = function (index) {
	let oldSel = this.curSel;
	this.curSel = index;

	if (oldSel != this.curSel) {
		let shouldHighlight = !Phaser.Device.touch;

		// Update scale
		this.items[oldSel].obj.scale.setTo(this.scl);
		this.items[this.curSel].obj.scale.setTo(shouldHighlight ? this.sclHighlight : this.scl);
	
		let y = Math.floor(this.items[this.curSel].obj.centerY + this.items[this.curSel].obj.height + this.selectorSpace);
		this.selector.y = y;
		this.selector.x = this.items[this.curSel].x;
	}
}