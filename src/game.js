let Game = {
	debug: 1,
	states: {},

	width: 414,
	height: 736,

	log: function() {
		if (Game.debug) {
			console.log.apply(console, arguments);
		}
	}
}