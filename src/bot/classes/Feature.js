import Datastore from "nedb";
import MainProcess from "./MainProcess";

export default class Feature {
	constructor({ name, icon, initialState = {}, bot, dbPath, tools }) {
		this.name = name;
		this.icon = icon;

		this.bot = bot;

		this.db = new Datastore(dbPath);
		this.state = initialState;

		this.ipcMain = new MainProcess();

		this.tools = tools;
	}

	updateState = updates => {
		this.state = {
			...this.state,
			...updates
		};
	};

	onChat = () => {};
}
