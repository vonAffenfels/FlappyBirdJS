import Phaser from 'phaser';

export default class TreeObject extends Phaser.Group {
	constructor(game, parent, index, gap, speed) {
		super(game, parent);

		this.datapusValues = [
			"GOOGLE", "FACEBOOK", "YOUTUBE", "MICROSOFT", "APPLE", "INSTAGRAM", "BLOGSPOT", "IMDB", "AMAZON", "DROPBOX", "BING", "DIPLY", "NEWYORK TIMES", "YAHOO", "LINKEDIN", "XING", "TWITTER", 
			"PINTEREST", "TUMBLR", "WALMART", "EBAY", "CRAIGSLIST", "PAYPAL", "NETFLIX", "SPOTIFY", "PORNHUB", "WIKIPEDIA", "REDDIT", "ESPN", "CNN"
		]

		this.index = index;
		this.speed = speed;

		this.topTree = new Phaser.Sprite(this.game, 0, 0, "img_tree", 0);
		this.topTree.scale.setTo(0.75);

		this.bottomTree = new Phaser.Sprite(this.game, 0, 0, "img_tree", 1);
		this.bottomTree.scale.setTo(0.75);

		this.datapusText = new Phaser.BitmapText(this.game, this.bottomTree.x + 10, this.game.world.height - 50, "fnt_flappy", "", 24);

		this.game.physics.arcade.enableBody(this.topTree);
		this.game.physics.arcade.enableBody(this.bottomTree);
		this.game.physics.arcade.enableBody(this.datapusText);
		
		this.topTree.body.allowGravity = false;
		this.topTree.body.immovable = true;
		this.bottomTree.body.allowGravity = false;
		this.bottomTree.body.immovable = true;
		this.datapusText.body.allowGravity = false;
		this.datapusText.body.immovable = true;
		
		this.add(this.topTree);
		this.add(this.bottomTree);
		this.add(this.datapusText);

		this.gap = Math.min(this.game.world.height - 320, gap);

		this.topMin = 110 - this.topTree.height;
		this.topMax = this.game.world.height - this.topTree.height - this.gap - 160;
		this.running = false;
	}

	restart(x) {
		this.topTree.reset(0, 0);

		this.bottomTree.reset(0, this.topTree.height + this.gap);

		this.x = x;
		this.y = this.game.rnd.integerInRange(this.topMin, this.topMax);

		// Datenkrake
		let datapus = this.game.rnd.pick(this.datapusValues);
		this.datapusText.text = datapus;
		this.datapusText.reset(this.bottomTree.width + 20, this.height - 270 - this.y);

		if (this.running) {
			this.setAll("body.velocity.x", this.speed);
		}
	}

	getWorldX() {
		return this.topTree.world.x;
	}

	start() {
		this.setAll("body.velocity.x", this.speed);
		this.running = true;
	}

	stop() {
		this.setAll("body.velocity.x", 0);
		this.running = false;
	}

	getGapX() {
		return this.bottomTree.world.x + this.bottomTree.width;
	}
}