import MainProcess from "./MainProcess";
import Tools from "./Tools";

export default class Feature {
	constructor({ bot, db }) {
		this.bot = bot;
		this.db = db;
	}

	static featureName = "No Name Feature";
	static featureIcon = "ReportProblem";

	state = {};

	ipcMain = new MainProcess();

	tools = new Tools();

	updateState = updates => {
		this.state = {
			...this.state,
			...updates
		};
	};

	onInitialize = () => {};

	onChat = () => {};
}
