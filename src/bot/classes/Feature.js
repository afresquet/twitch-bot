import Datastore from "nedb";
import MainProcess from "./MainProcess";

export default class Feature {
	constructor({ name, icon, initialState = {}, bot, dbPath }) {
		this.name = name;
		this.icon = icon;

		this.bot = bot;

		this.db = new Datastore(dbPath);
		this.state = initialState;

		this.ipcMain = new MainProcess();
	}

	updateState = updates => {
		this.state = {
			...this.state,
			...updates
		};
	};

	onChat = () => {};
}
