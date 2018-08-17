import { app, BrowserWindow, ipcMain, dialog } from "electron";
import installExtension, {
	REACT_DEVELOPER_TOOLS
} from "electron-devtools-installer";
import { enableLiveReload } from "electron-compile";
import loadBot from "./bot";

let bot;
let features;
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: "react-hmr" });

const createWindow = async () => {
	mainWindow = new BrowserWindow({
		minWidth: 800,
		minHeight: 600
	});

	mainWindow.loadURL(`file://${__dirname}/react/index.html`);

	if (isDevMode) {
		await installExtension(REACT_DEVELOPER_TOOLS);
		mainWindow.webContents.openDevTools();
	}

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
};

const sendFeatures = async () =>
	features && mainWindow.webContents.send("features", features);

app.on("ready", async () => {
	try {
		[bot, features] = await loadBot();

		await Promise.all([createWindow(), bot.connect()]);

		await sendFeatures();
	} catch ({ message, stack }) {
		dialog.showErrorBox(message, stack);
	}
});

app.on("activate", async () => {
	if (mainWindow !== null) return;

	await createWindow();

	await sendFeatures();
});

ipcMain.on("requestFeatures", sendFeatures);

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
