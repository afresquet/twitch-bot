import { BrowserWindow, dialog } from "electron";
import keytar from "keytar";
import installExtension, {
	REACT_DEVELOPER_TOOLS
} from "electron-devtools-installer";
import { enableLiveReload } from "electron-compile";
import setupIPCMain from "./ipcMain";
import createBot from "../bot";
import { initializeFeatures } from "../bot/helpers/features";
import isDevMode from "./helpers/isDevMode";

if (isDevMode) enableLiveReload({ strategy: "react-hmr" });

export class AppState {
	mainWindow = null;
	bot = null;
	features = null;

	onStartUp = async () => {
		try {
			await this.loadBot();

			setupIPCMain();

			this.createMainWindow();
		} catch ({ message, stack }) {
			dialog.showErrorBox(message, stack);
		}
	};

	createMainWindow = async () => {
		try {
			if (this.mainWindow !== null) return;

			this.mainWindow = new BrowserWindow({
				minWidth: 800,
				minHeight: 600
			});

			this.mainWindow.loadURL(`file://${__dirname}/../react/index.html`);

			if (isDevMode) {
				await installExtension(REACT_DEVELOPER_TOOLS);
				this.mainWindow.webContents.openDevTools();
			}

			this.mainWindow.on("closed", () => {
				this.closeMainWindow();
			});

			this.sendFeatures();
		} catch ({ message, stack }) {
			dialog.showErrorBox(message, stack);
		}
	};

	closeMainWindow = () => {
		this.mainWindow = null;
	};

	loadBot = async () => {
		try {
			const [userCredentials] = await keytar.findCredentials("TwitchBot_User");
			const [botCredentials] = await keytar.findCredentials("TwitchBot_Bot");

			this.bot = createBot(userCredentials, botCredentials);
			this.features = await initializeFeatures();

			this.bot.on("connected", () =>
				this.bot.action(userCredentials.account, "is up and running...")
			);

			this.bot.connect();
		} catch (err) {
			throw err;
		}
	};

	addFeature = feature => {
		if (!this.features || !this.features.addons) return;

		this.features.addons.push(feature);
	};

	sendFeatures = () => {
		if (!this.features) return;

		this.mainWindow.webContents.send("features", this.features);
	};
}

export default new AppState();
