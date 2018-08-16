import { ipcMain, BrowserWindow } from "electron";

export default class MainProcess {
	static prefixCounter = -1;
	static get nextPrefix() {
		MainProcess.prefixCounter += 1;
		return MainProcess.prefixCounter;
	}

	prefix = MainProcess.nextPrefix;

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
