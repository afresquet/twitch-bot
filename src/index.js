import { app, BrowserWindow, dialog } from "electron";
import installExtension, {
	REACT_DEVELOPER_TOOLS
} from "electron-devtools-installer";
import { enableLiveReload } from "electron-compile";
import state from "./electron/AppState";
import loadBot from "./bot";
import setupIPCMain from "./electron/ipcMain";
import sendFeatures from "./electron/helpers/sendFeatures";

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: "react-hmr" });

const createWindow = async () => {
	try {
		state.set(
			"mainWindow",
			new BrowserWindow({
				minWidth: 800,
				minHeight: 600
			})
		);

		state.mainWindow.loadURL(`file://${__dirname}/react/index.html`);

		if (isDevMode) {
			await installExtension(REACT_DEVELOPER_TOOLS);
			state.mainWindow.webContents.openDevTools();
		}

		state.mainWindow.on("closed", () => {
			state.closeMainWindow();
		});

		sendFeatures();
	} catch ({ message, stack }) {
		dialog.showErrorBox(message, stack);
	}
};

app.on("ready", async () => {
	try {
		await loadBot();

		setupIPCMain();

		state.bot.connect();

		createWindow();
	} catch ({ message, stack }) {
		dialog.showErrorBox(message, stack);
	}
});

app.on("activate", () => state.mainWindow === null && createWindow());

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
