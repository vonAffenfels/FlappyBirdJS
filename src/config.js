import Phaser from 'phaser';

import Enums from './enums';

export default class GameConfig {
	constructor() {
		this._data = {
			game: {
				width: 320,
				height: 568,
				enableDebug: false,
				backgroundColor: '#89bfdc',
				renderer: Phaser.CANVAS,
				name: "FlappyBirdJS",
				parent: "game"
			},

			fontSize: {
				title: 			42,
				menu: 			28,
				menuHighlight: 	34,
				score: 			64
			},

			defaultState: 		Enums.States.BOOT,
			availableColors: 	10,
			scoreGain:  		10,

			physics: {
				gravity: 	1300,
				flapForce: 	-400
			},

			trees: {
				// Gap between trees in Y
				gap: 		150,

				// Speed of the trees (and ground)
				speed: 		-200,

				// Distance between trees in X
				distance: 	300 
			}
		};
	}

	get(key, def) {
		let keys = key.split(".");

		let curVal = this._data;
		while (keys.length > 0) {
			let curKey = keys.shift();
			if (!curVal.hasOwnProperty(curKey)) {
				return def;
			}

			curVal = curVal[curKey];
		}

		return curVal;
	}
}