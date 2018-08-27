import { ipcRenderer } from "../helpers/react-electron";

export default class RendererProcess {
	constructor(prefix) {
		this.prefix = prefix;
	}

	on = (channel, listener) =>
		ipcRenderer.on(`${this.prefix}-${channel}`, listener);

	once = (channel, listener) =>
		ipcRenderer.once(`${this.prefix}-${channel}`, listener);

	removeListener = (channel, listener) =>
		ipcRenderer.removeListener(`${this.prefix}-${channel}`, listener);

	removeAllListeners = channel =>
		ipcRenderer.removeAllListeners(
			channel ? `${this.prefix}-${channel}` : null
		);

	send = (channel, ...args) =>
		ipcRenderer.send(`${this.prefix}-${channel}`, ...args);
}
