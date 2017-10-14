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

		// Draw trees
		this.trees = new Game.objects.TreeGroup(this.game, Game.config.trees.gap, Game.config.trees.speed, Game.config.trees.distance);

		// Draw ground
		this.ground = new Game.objects.Ground(this.game, Game.config.trees.speed);

		// Draw bird
		this.bird = new Game.objects.Bird(this.game, 200, this.game.world.centerY);

		// Draw Countdown
		this.countdown = this.game.add.bitmapText(this.game.world.centerX, 200, "fnt_flappy", this.countdownPosition, this.beginFontSize);
		this.countdown.anchor.setTo(0.5);

		// Start Countdown Tween
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
		}
	},

	update: function () {
		let keySpace = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		// Check if a tree is outside the drawing area (to the left)
		this.trees.checkVisibilty();

		if (this.started) {
			if (keySpace.justPressed()) {
				this.bird.flap();
			}
		}
	}
}