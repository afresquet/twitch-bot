import { BrowserWindow, dialog } from "electron";
import keytar from "keytar";
import installExtension, {
	REACT_DEVELOPER_TOOLS
} from "electron-devtools-installer";
import { enableLiveReload } from "electron-compile";
import Bot from "../bot";
import setupIPCMain from "./ipcMain";
import isDevMode from "./helpers/isDevMode";

if (isDevMode) enableLiveReload({ strategy: "react-hmr" });

export class AppState {
	mainWindow = null;
	bot = null;

	onStartUp = async () => {
		try {
			const [userCredentials] = await keytar.findCredentials("TwitchBot_User");
			const [botCredentials] = await keytar.findCredentials("TwitchBot_Bot");

			this.bot = new Bot(userCredentials, botCredentials);
			await this.bot.initialize();

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

	sendFeatures = () => {
		if (!this.bot.features) return;

		this.mainWindow.webContents.send("features", this.bot.features);
	};
}

export default new AppState();
