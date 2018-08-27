import { app as electron } from "electron";
import app from "./electron/AppState";

electron.on("ready", app.onStartUp);

electron.on("activate", app.createMainWindow);

electron.on(
	"window-all-closed",
	() => process.platform !== "darwin" && electron.quit()
);
