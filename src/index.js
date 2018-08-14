import { app, BrowserWindow } from "electron";
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
		width: 800,
		height: 600
	});

	mainWindow.loadURL(`file://${__dirname}/react/index.html`);

	if (isDevMode) await installExtension(REACT_DEVELOPER_TOOLS);

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
};

app.on("ready", async () => {
	await createWindow();

	await new Promise(resolve =>
		mainWindow.webContents.on("did-finish-load", resolve)
	);

	[bot, features] = await loadBot(mainWindow);
	await bot.connect();
});

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

app.on("activate", async () => {
	if (mainWindow !== null) return;

	await createWindow();

	await new Promise(resolve =>
		mainWindow.webContents.on("did-finish-load", resolve)
	);

	mainWindow.webContents.send("sendFeatures", await Promise.all(features));
});
