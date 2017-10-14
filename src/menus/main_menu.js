if (!Game) Game = {};
if (!Game.menus) Game.menus = {};

Game.menus.MainMenu = function (game, state) {
	Phaser.Group.call(this, game);

	this.state = state;
	this.visible = false;
	this.curSel = 0;

	this.items = [
		{
			text: "Start",
			action: function () {
				console.log("START");
			}
		},
		{
			text: "Farbwahl",
			action: function () {
				console.log("SELECT");
			}
		}
	];

	this.fontSize = 64;
	this.fontSizeHighlight = 74;
	this.selectorSpace = 16;
}

Game.menus.MainMenu.prototype = Object.create(Phaser.Group.prototype);
Game.menus.MainMenu.prototype.constructor = Game.menus.MainMenu;

// Draw the menu
Game.menus.MainMenu.prototype.draw = function () {
	let space = 16;

	// Calculate height of whole menu
	let menuHeight = (this.fontSize + space) * this.items.length - space;

	for (let i = 0; i < this.items.length; i++) {
		let posY = Math.floor(this.game.world.centerY + (this.fontSize / 2) + (menuHeight / 2) * (i - 1));

		this.items[i].obj = this.game.add.bitmapText(this.game.world.centerX, posY, "fnt_flappy", this.items[i].text, i == this.curSel ? this.fontSizeHighlight : this.fontSize, this);
		this.items[i].obj.anchor.setTo(0.5);
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
	this.selector.animations.add("flap", [Game.save.selectedColor * 2, Game.save.selectedColor * 2 + 1]);
	this.selector.animations.play("flap", 8, true);
	this.selector.anchor.setTo(1, 0.6);
}

// Handle updates
Game.menus.MainMenu.prototype.handle = function () {
	let oldSel = this.curSel;
	let cursors = this.game.input.keyboard.createCursorKeys();
	let keySpace = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

	if (cursors.down.justPressed()) {
		this._setSelected(Math.min(this.items.length - 1, this.curSel + 1));
	} else if (cursors.up.justPressed()) {
		this._setSelected(Math.max(0, this.curSel - 1));
	} else if (keySpace.justPressed()) {
		this.items[this.curSel].action.call(this);
	}
}

// Set new selected menuitem
Game.menus.MainMenu.prototype._setSelected = function (index) {
	let oldSel = this.curSel;
	this.curSel = index;

	if (oldSel != this.curSel) {
		// Update fontsize
		this.items[oldSel].obj.fontSize = this.fontSize
		this.items[this.curSel].obj.fontSize = this.fontSizeHighlight
	
		let x = Math.floor(this.items[this.curSel].obj.centerX - this.items[this.curSel].obj.width / 2 - this.selectorSpace);
		this.selector.x = x;
		this.selector.y = this.items[this.curSel].y;
	}
}