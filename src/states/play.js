if (!Game) Game = {};
if (!Game.states) Game.states = {};

Game.states.Play = function (game) {
	this.beginFontSize = 256;
	this.endFontSize = 32;
}

Game.states.Play.prototype = {
	create: function () {
		
		this.countdownPosition = 3;
		this.started = false;
		this.gameover = false;
		this.score = 0;

		// Draw trees
		this.trees = new Game.objects.TreeGroup(this.game, Game.config.trees.gap, Game.config.trees.speed, Game.config.trees.distance);

		// Draw ground
		this.ground = new Game.objects.Ground(this.game, Game.config.trees.speed);

		// Draw bird
		this.bird = new Game.objects.Bird(this.game, 200, this.game.world.centerY);

		// Draw score
		this.scoreBoard = this.game.add.bitmapText(this.game.world.centerX, 100, "fnt_flappy", this.score + "", 96);
		this.scoreBoard.anchor.setTo(0.5);
		this.scoreBoard.visible = false;

		// Draw Gameover Screen
		this.gameoverHeadline = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 50, "fnt_flappy", "Game Over", 160);
		this.gameoverHeadline.anchor.setTo(0.5);
		this.gameoverHeadline.visible = false;
		this.gameoverSubline = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 70, "fnt_flappy", "Press Space or Tap to continue", 64);
		this.gameoverSubline.anchor.setTo(0.5);
		this.gameoverSubline.visible = false;

		// New Highscore Message
		this.highscoreMessage = this.game.add.bitmapText(this.game.world.centerX, 200, "fnt_flappy", "Neuer Highscore!", 64);
		this.highscoreMessage.anchor.setTo(0.5);
		this.highscoreMessage.visible = false;

		// Draw Countdown
		this.countdown = this.game.add.bitmapText(this.game.world.centerX, 200, "fnt_flappy", this.countdownPosition, this.beginFontSize);
		this.countdown.anchor.setTo(0.5);

		// Countdown Tween
		this.countdownTween = this.game.add.tween(this.countdown);
		this.countdownTween.to({fontSize: this.endFontSize, alpha: 0}, 1000, Phaser.Easing.Linear.None);
		this.countdownTween.onComplete.add(this._countdown, this);
		this.countdownTween.start();
	},

	_countdown: function () {
		this.countdownPosition--;

		if (this.countdownPosition > -1) {
			this.countdown.setText(this.countdownPosition > 0 ? this.countdownPosition : "Start");
			this.countdown.alpha = 1;
			this.countdown.fontSize = this.beginFontSize;
			this.countdownTween.start();
		} else {
			this.started = true;

			// Start moving objects
			this.trees.start();
			this.ground.start();
			this.bird.start();

			// Show scoreboard
			this.scoreBoard.visible = true;
		}
	},

	_gameover: function () {
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
	},

	_gameoverComplete: function () {
		// Show Gameover
		this.gameoverHeadline.visible = true;
		this.gameoverSubline.visible = true;

		if (this.score > Game.save.highscore) {
			this.highscoreMessage.visible = true;
			Game.save.highscore = this.score;
			Game.saveState();
		}

		this.gameover = true;
	},

	update: function () {
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
				this.score += Game.config.scoreGain;
				this.scoreBoard.setText(this.score);
				this.trees.activateNextTree();
			}
		}

		if (this.gameover && keySpace.justPressed()) {
			// Exit to Mainmenu
			this.game.state.start("menu");
		}
	}
}