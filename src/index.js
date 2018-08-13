import { app, BrowserWindow } from "electron";
import installExtension, {
	REACT_DEVELOPER_TOOLS
} from "electron-devtools-installer";
import { enableLiveReload } from "electron-compile";
import loadBot from "./bot";

let bot;
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: "react-hmr" });

const createWindow = async () => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
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

app.on("ready", async () => {
	bot = await loadBot();
	await bot.connect();

	await createWindow();
});

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

app.on("activate", () => mainWindow === null && createWindow());
