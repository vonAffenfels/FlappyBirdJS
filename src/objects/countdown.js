import Phaser from 'phaser';

export default class CountdownObject extends Phaser.Group {
	constructor(game, x, y, countdownLength, beginSize, endSize) {
		super(game);

		this.onCountdownEnd = new Phaser.Signal();

		this.x 					= x;
		this.y					= y;
		this.beginSize 			= beginSize 		|| 96;
		this.endSize 			= endSize 			|| 12;
		this.countdownPosition	= countdownLength 	|| 3;

		// Draw Countdown
		this.countdown = this.game.add.translatedBitmapText(0, 0, "fnt_flappy", this.countdownPosition, this.beginSize, 'left', {}, this);
		this.countdown.anchor.setTo(0.5);
		
		// Countdown Tween
		this.tween = this.game.add.tween(this.countdown);
		this.tween.to({fontSize: this.endSize, alpha: 0}, 1000, Phaser.Easing.Linear.None);
		this.tween.onComplete.add(this._tweenEnd, this);
	}

	start() {
		this.tween.start();
	}

	stop() {
		this.tween.stop();
	}

	_tweenEnd() {
		this.countdownPosition--;

		if (this.countdownPosition > -1) {
			// Countdown still running
			this.countdown.setText(this.countdownPosition > 0 ? this.countdownPosition : "go");
			this.countdown.alpha = 1;
			this.countdown.fontSize = this.beginSize;
			this.tween.start();
		} else {
			// Countdown finished
			this.onCountdownEnd.dispatch();
		}	
	}
}