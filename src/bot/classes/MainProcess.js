import { ipcMain, BrowserWindow } from "electron";

export default class MainProcess {
	constructor() {
		this.prefix = "abcde";
	}

	on = (channel, listener) => ipcMain.on(`${this.prefix}-${channel}`, listener);

	once = (channel, listener) =>
		ipcMain.once(`${this.prefix}-${channel}`, listener);

	removeListener = (channel, listener) =>
		ipcMain.removeListener(`${this.prefix}-${channel}`, listener);

	removeAllListeners = channel =>
		ipcMain.removeAllListeners(channel ? `${this.prefix}-${channel}` : null);

	send = (channel, ...args) => {
		const [window] = BrowserWindow.getAllWindows();

		window.webContents.send(`${this.prefix}-${channel}`, ...args);
	};
}
