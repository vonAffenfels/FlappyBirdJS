Game.Menus.MainMenu = function (game, state) {
	Phaser.Group.call(this, game);

	this.state = state;
	this.visible = false;
	this.curSel = 0;
	this.curColor = Game.save.selectedColor;

	this.items = [
		{
			text: "Start",
			action: function () {
				this.game.state.start("play");
			}
		}
	];

	if (Game.config.availableColors > 1) {
		this.items.push({
			text: "Farbwahl",
			action: function () {
				this.state.changeMenu(Game.States.Menu.MENU_COLOR_SELECT);
			}
		});
	}

	this.fontSize = 64;
	this.fontSizeHighlight = 74;
	this.selectorSpace = 16;
}

Game.Menus.MainMenu.prototype = Object.create(Phaser.Group.prototype);
Game.Menus.MainMenu.prototype.constructor = Game.Menus.MainMenu;

// Draw the menu
Game.Menus.MainMenu.prototype.draw = function () {
	let space = 16;

	// Calculate height of whole menu
	let menuHeight = (this.fontSize + space) * this.items.length - space;

	// Calculate topmost position
	let baseY = this.game.world.centerY - (menuHeight / 2);

	for (let i = 0; i < this.items.length; i++) {
		let posY = Math.floor(baseY + (this.fontSize + space) * i);

		// Only highlight if current item and no touch available
		let shouldHighlight = (i == this.curSel && !Phaser.Device.touch);
		this.items[i].obj = this.game.add.bitmapText(this.game.world.centerX, posY, "fnt_flappy", this.items[i].text, shouldHighlight ? this.fontSizeHighlight : this.fontSize, this);
		this.items[i].obj.anchor.setTo(0.5, 0);
		this.items[i].obj.inputEnabled = true;
		this.items[i].obj.events.onInputOver.add(function () {
			this._setSelected(i);
		}, this);
		this.items[i].obj.events.onInputDown.add(function () {
			this.items[this.curSel].action.call(this);
		}, this);
		this.items[i].y = posY;
	}

	// Selector bird
	let x = Math.floor(this.items[this.curSel].obj.centerX - this.items[this.curSel].obj.width / 2 - this.selectorSpace);
	this.selector = this.game.add.sprite(x, this.items[this.curSel].y, "img_bird", 1, this);
	this.selector.animations.add("flap", [this.curColor * 2, this.curColor * 2 + 1]);
	this.selector.animations.play("flap", 8, true);
	this.selector.anchor.setTo(1, -0.5);
	this.selector.visible = !Phaser.Device.touch;

	if (Phaser.Device.touch) {
		// Show selected color beneath menu
		this.selectedColor = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 200, "img_bird", 1, this);
		this.selectedColor.animations.add("flap", [this.curColor * 2, this.curColor * 2 + 1]);
		this.selectedColor.animations.play("flap", 8, true);
		this.selectedColor.anchor.set(0.5);
	}
}

// Handle updates
Game.Menus.MainMenu.prototype.handle = function () {
	let oldSel = this.curSel;
	let cursors = this.game.input.keyboard.createCursorKeys();
	let keySpace = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

	// Check selector image
	if (this.curColor != Game.save.selectedColor) {
		this.curColor = Game.save.selectedColor;
		this.selector.animations.add("flap", [this.curColor * 2, this.curColor * 2 + 1]);
		this.selector.animations.play("flap", 8, true);

		if (this.selectedColor) {
			this.selectedColor.animations.add("flap", [this.curColor * 2, this.curColor * 2 + 1]);
			this.selectedColor.animations.play("flap", 8, true);			
		}
	}

	if (cursors.down.justPressed()) {
		this._setSelected(Math.min(this.items.length - 1, this.curSel + 1));
	} else if (cursors.up.justPressed()) {
		this._setSelected(Math.max(0, this.curSel - 1));
	} else if (keySpace.justPressed()) {
		this.items[this.curSel].action.call(this);
	}
}

// Set new selected menuitem
Game.Menus.MainMenu.prototype._setSelected = function (index) {
	let oldSel = this.curSel;
	this.curSel = index;

	if (oldSel != this.curSel) {
		let shouldHighlight = !Phaser.Device.touch;

		// Update fontsize
		this.items[oldSel].obj.fontSize = this.fontSize
		this.items[this.curSel].obj.fontSize = shouldHighlight ? this.fontSizeHighlight : this.fontSize;
	
		let x = Math.floor(this.items[this.curSel].obj.centerX - this.items[this.curSel].obj.width / 2 - this.selectorSpace);
		this.selector.x = x;
		this.selector.y = this.items[this.curSel].y;
	}
}