import Phaser from 'phaser';

import Enums from '../enums';

// Objects
import TreeGroupObject from '../objects/tree_group';
import GroundObject from '../objects/ground';
import BirdObject from '../objects/bird';
import CountdownObject from '../objects/countdown';

export class PlayState extends Phaser.State {
	constructor() {
		super();
	}

	create() {
		let centerX = this.game.world.centerX;
		let centerY = this.game.world.centerY;

		this.started = false;
		this.gameover = false;
		this.score = 0;

		this.input.onTap.add(this._onTap, this);

		// Draw trees
		this.trees = new TreeGroupObject(this.game, this.game.config.get("trees.gap"), this.game.config.get("trees.speed"), this.game.config.get("trees.distance"));

		// Draw ground
		this.ground = new GroundObject(this.game, this.game.config.get("trees.speed"));

		// Draw bird
		this.bird = new BirdObject(this.game, 50, centerY - 50);

		// Draw score
		this.scoreBoard = this.game.add.bitmapText(centerX, 100, "fnt_flappy", this.score + "", this.game.config.get("fontSize.score"));
		this.scoreBoard.anchor.setTo(0.5);
		this.scoreBoard.visible = false;

		// Draw Gameover Screen
		this.gameoverHeadline = this.game.add.translatedBitmapText(centerX, centerY - 50, "fnt_flappy", "gameover", this.game.config.get("fontSize.title"));
		this.gameoverHeadline.anchor.setTo(0.5);
		this.gameoverHeadline.visible = false;
		this.gameoverSubline = this.game.add.translatedBitmapText(centerX, centerY + 70, "fnt_flappy", Phaser.Device.touch ? "tapToContinue" : "spaceToContinue", this.game.config.get("fontSize.menu"));
		this.gameoverSubline.anchor.setTo(0.5);
		this.gameoverSubline.visible = false;

		// New Highscore Message
		this.highscoreMessage = this.game.add.translatedBitmapText(centerX, centerY + 10, "fnt_flappy", "newHighscore", this.game.config.get("fontSize.menu"));
		this.highscoreMessage.anchor.setTo(0.5);
		this.highscoreMessage.visible = false;

		// Countdown
		this.countdown = new CountdownObject(this.game, centerX, 100);
		this.countdown.onCountdownEnd.add(this._afterCountdown, this);
		this.countdown.start();
		this.game.add.existing(this.countdown);
	}

	_afterCountdown() {
		this.countdown.destroy();

		this.started = true;

		// Start moving objects
		this.trees.start();
		this.ground.start();
		this.bird.start();

		// Show scoreboard
		this.scoreBoard.visible = true;
	}

	_gameover() {
		this.started = false;

		// Stop moving objects
		this.trees.stop();
		this.ground.stop();
		this.bird.stop();

		// Gameover Tween
		this.gameoverTween = this.game.add.tween(this.bird);
		this.gameoverTween.to({y: [this.bird.y - 100, this.game.world.height + this.bird.height]}, 1000, Phaser.Easing.Linear.None);
		this.gameoverTween.interpolation(Phaser.Math.catmullRomInterpolation);
		this.gameoverTween.onComplete.add(this._gameoverComplete, this);
		this.gameoverTween.start();
	}

	_gameoverComplete() {
		// Show Gameover
		this.gameoverHeadline.visible = true;
		this.gameoverSubline.visible = true;

		if (this.score > this.game.save.get("highscore")) {
			this.highscoreMessage.visible = true;
			this.game.save.set("highscore", this.score);
		}

		this.gameover = true;
	}

	_onTap() {
		if (this.started) {
			this.bird.flap();
		}

		if (this.gameover) {
			// Exit to Mainmenu
			this.game.state.start(Enums.States.MENU);
		}
	}

	update() {
		let keySpace = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		// Check if a tree is outside the drawing area (to the left)
		this.trees.checkVisibilty();

		if (this.started) {
			if (keySpace.justPressed()) {
				this.bird.flap();
			}

			// Check for vertical boundaries
			if (this.bird.y + this.bird.height > this.game.world.height - this.ground.height || this.bird.y < -this.bird.height) {
				return this._gameover();
			}

			// Check for collisions
			if (this.trees.isColliding(this.bird)) {
				// Collision detected
				return this._gameover();
			}

			// Check if we should activate next tree
			if (this.trees.hasPassed(this.bird)) {
				this.score += this.game.config.get("scoreGain");
				this.scoreBoard.setText(this.score);
				this.trees.activateNextTree();
			}
		}

		if (this.gameover && keySpace.justPressed()) {
			// Exit to Mainmenu
			this.game.state.start(Enums.States.MENU);
		}
	}
}