export class AppState {
	mainWindow = null;
	bot = null;
	features = null;

	set = (property, data) => {
		this[property] = data;
	};

	closeMainWindow = () => {
		this.mainWindow = null;
	};

	addFeature = feature => {
		if (!this.features || !this.features.addons) return;

		this.features.addons.push(feature);
	};
}

export default new AppState();
