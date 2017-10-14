let Game = {
	states: 	{},
	objects: 	{},
	menus: 		{}, 

	config: {
		width: 		1024,
		height: 	768,

		availableColors: 10,

		physics: {
			gravity: 1300
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
		selectedColor: 0,
		highscore: 0
	}
}