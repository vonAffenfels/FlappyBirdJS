class GameSave {
	constructor(game) {
		this.game = game;

		this._data = {
			version: 1,
			highscore: 0,
			selectedColor: 1
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