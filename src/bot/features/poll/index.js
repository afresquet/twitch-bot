import onChat from "./callbacks/onChat";
import { onLoadData, onUpdateSettings } from "./callbacks/ipcMain";

export default Feature =>
	class Poll extends Feature {
		constructor(settings) {
			const initialState = {
				pollActive: false,
				poll: {},
				voters: []
			};

			super({
				name: "Poll",
				icon: "Assignment",
				initialState,
				...settings
			});

			this.initialState = initialState;
			this.db.loadDatabase();

			this.ipcMain.on("load-data", this.onLoadData);
			this.ipcMain.on("update-settings", this.onUpdateSettings);
		}

		onChat = onChat.bind(this);

		onLoadData = onLoadData.bind(this);

		onUpdateSettings = onUpdateSettings.bind(this);
	};
