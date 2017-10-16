class Game extends Phaser.Game {
	constructor() {
		let config = new GameConfig();
		super(config.get("game"));

		this.config = config;
		this.save = new GameSave(this);

		for (let stateName in Game.Enums.States) {
			let state = Game.Enums.States[stateName]
			this.state.add(state, window[state]);
		}

		this.state.start(this.config.get("defaultState"));
	}
}