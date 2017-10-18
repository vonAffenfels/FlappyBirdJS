export default class GameSave {
	constructor(game) {
		this.game = game;

		this._data = {
			version: "vA-1.0.0",
			highscore: 0,
			selectedColor: 0
		};

		this._load();
	}

	_load() {
		let saveState = localStorage.getItem(this.game.config.get("game.name"));
		if (!saveState) {
			return this._save();
		}
		
		let saveObj = JSON.parse(saveState);
		if (!saveObj) {
			return this._save();
		}

		if (!saveObj.version || saveObj.version != this._data.version) {
			return this._save();
		}

		this._data = saveObj;
		if (this._data.selectedColor >= this.game.config.get("availableColors")) {
			this._data.selectedColor = 0;
		}
	}

	_save() {
		localStorage.setItem(this.game.config.get("game.name"), JSON.stringify(this._data));
	}

	get(key, def) {
		return this._data.hasOwnProperty(key) ? this._data[key] : def;
	}

	set(key, val) {
		this._data[key] = val;
		this._save();
	}
}