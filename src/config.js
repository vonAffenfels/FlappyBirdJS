import Phaser from 'phaser';

import Enums from './enums';

export default class GameConfig {
	constructor() {
		this._data = {
			game: {
				baseWidth: 320,
				baseHeight: 568,
				maxWidth: 768,
				width: "100%",
				height: "100%",
				enableDebug: false,
				backgroundColor: '#000000',
				renderer: Phaser.CANVAS,
				name: "FlappyBirdJS"
			},

			fontSize: {
				title: 			42,
				menu: 			28,
				menuHighlight: 	34,
				score: 			64
			},

			defaultState: 		Enums.States.BOOT,
			availableColors: 	1,
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