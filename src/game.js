import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Enums from './enums';
import GameSave from './save';
import GameConfig from './config';
import * as States from './states';

class Game extends Phaser.Game {
	constructor() {
		let config = new GameConfig();
		super(config.get("game"));

		this.config = config;
		this.save = new GameSave(this);

		for (let stateName in Enums.States) {
			let state = Enums.States[stateName]
			this.state.add(state, States[state]);
		}

		this.state.start(this.config.get("defaultState"));
	}
}

window.Game = Game;