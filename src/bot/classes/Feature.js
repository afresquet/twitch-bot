import MainProcess from "./MainProcess";
import tools from "./Tools";

export default class Feature {
	constructor({ bot, db }) {
		this.bot = bot;
		this.db = db;

		this.ipcMain = new MainProcess();
		this.tools = Object.assign({}, tools);
	}

	static featureName = "No Name Feature";
	static featureIcon = "ReportProblem";

	state = {};

	updateState = updates => {
		this.state = {
			...this.state,
			...updates
		};
	};

	onInitialize = () => {};

	onChat = () => {};
}
