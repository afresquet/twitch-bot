import { app, BrowserWindow } from "electron";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

let mainWindow;
const createWindow = () => {
	mainWindow = new BrowserWindow({ width: 800, height: 600 });

	mainWindow.loadURL(`http://localhost:${port}`);

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
};

app.on("ready", createWindow);

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

app.on("activate", () => mainWindow === null && createWindow());
