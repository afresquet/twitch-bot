import { app, BrowserWindow } from "electron";
import dotenv from "dotenv";
import "babel-polyfill";
import bot from "./bot";

dotenv.config();

bot.connect();

let mainWindow;
const createWindow = () => {
	mainWindow = new BrowserWindow({ width: 800, height: 600 });

	mainWindow.loadURL(`http://localhost:${process.env.PORT || 3000}`);

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
};

app.on("ready", createWindow);

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

app.on("activate", () => mainWindow === null && createWindow());
