let Game = {
	states: 	{},
	objects: 	{},
	menus: 		{}, 

	config: {
		width: 		1024,
		height: 	768,

		availableColors: 	10,
		scoreGain:  		10,

		physics: {
			gravity: 1300,
			flapForce: -400
		},

		trees: {
			// Gap between trees in Y
			gap: 		150,

			// Speed of the trees (and ground)
			speed: 		-200,

			// Distance between trees in X
			distance: 	300
		}
	},

	save: {
		version: 0x000001,
		selectedColor: 0,
		highscore: 0
	}
}

Game.saveState = function () {
	localStorage.setItem("FlappyBirdJS", JSON.stringify(Game.save));
}

Game.loadState = function () {
	let saveState = localStorage.getItem("FlappyBirdJS");
	if (!saveState) {
		Game.saveState();
		return;
	}
	
	let saveObj = JSON.parse(saveState);
	if (!saveObj) {
		Game.saveState();
		return;
	}

	if (!saveObj.version || saveObj.version != Game.save.version) {
		Game.saveState();
		return;
	}

	Game.save = saveObj;
}