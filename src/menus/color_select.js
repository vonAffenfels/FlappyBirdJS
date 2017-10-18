import Phaser from 'phaser';

import Enums from '../enums';

export default class ColorSelectMenu extends Phaser.Group {
	constructor(game, state) {
		super(game);

		this.state = state;
		this.visible = false;
		this.curSel = this.game.save.get("selectedColor");

		this.items = [];

		for (let i = 0; i < this.game.config.get("availableColors"); i++) {
			this.items.push({
				sprite: "img_bird",
				frame: i * 2
			});
		}

		this.scl = 1;
		this.sclHighlight = 1;
		this.imgWidth 	= 36 * this.scl;
		this.imgHeight 	= 36 * this.scl;
		this.selectorFontSize = 54;
		this.selectorSpace = 20;
	}

	draw() {
		let space = 36;

		// Calculate width of whole menu
		let menuWidth = this.items.length * (this.imgWidth + space) - space;
		let rows = 1;
		let itemsInRow = this.items.length;
		let menuSpace = this.game.world.width - space * 2;

		if (menuWidth > menuSpace) {
			// Menu is wider than screen
			rows = Math.ceil(menuWidth / menuSpace);
			itemsInRow = Math.ceil(this.items.length / rows);
			menuWidth = itemsInRow * (this.imgWidth + space) - space;
		}

		let rowHeight = this.imgHeight + this.selectorSpace + this.selectorFontSize;
		let menuHeight = rows * rowHeight;

		// Calculate top left position
		let baseX = Math.floor(this.game.world.centerX - (menuWidth / 2) + space / 2);
		let baseY = Math.floor(this.game.world.centerY - (rowHeight / 2) * 3);

		let currentRow = 0;

		for (let i = 0; i < this.items.length; i++) {
			if (i % itemsInRow == 0) {
				currentRow++;

				if (currentRow == rows && rows > 1) {
					let leftMembers = this.items.length % itemsInRow;
					if (leftMembers == 0) {
						leftMembers = itemsInRow;
					}
					menuWidth = leftMembers * (this.imgWidth + space) - space;
					baseX = this.game.world.centerX - (menuWidth / 2) + space / 2;
				}
			}

			let posX = Math.floor(baseX + (this.imgWidth + space) * (i % itemsInRow));
			let posY = Math.floor(baseY + rowHeight * currentRow);

			let shouldHighlight = (i == this.curSel && !Phaser.Device.touch);

			this.items[i].obj = this.game.add.sprite(posX, posY, "img_bird", i * 2, this);
			this.items[i].obj.scale.setTo(shouldHighlight ? this.sclHighlight : this.scl);
			this.items[i].obj.anchor.set(0.5);
			this.items[i].obj.animations.add("anim", [this.items[i].frame, this.items[i].frame + 1]);
			this.items[i].obj.animations.play("anim", 8, true);
			this.items[i].obj.inputEnabled = true;

			if (Phaser.Device.touch) {
				this.items[i].obj.events.onInputDown.add(function () {
					this._setColor(i);
				}, this);
			}
			this.items[i].x = posX;
		}

		// Selector char
		let y = Math.floor(this.items[this.curSel].obj.centerY + this.items[this.curSel].obj.height + this.selectorSpace);
		this.selector = this.game.add.bitmapText(this.items[this.curSel].x, y, "fnt_flappy", "^", this.selectorFontSize, this);
		this.selector.anchor.setTo(0.5);
		this.selector.visible = !Phaser.Device.touch;
	}

	handle() {
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

	_setColor(color) {
		this.game.save.set("selectedColor", color);
		this.state.changeMenu(Enums.Menus.MAIN);
	}

	_setSelected(index) {
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
}