import { BrowserWindow } from "electron";

/**
 * Creates a new window with the UI for a feature.
 * @param {string} path Path of the feature
 * @param {Object} config Configurations for BrowserWindow
 */
export default (path, config) => {
	let window;

	return () => {
		window = new BrowserWindow(config);

		window.loadURL(`file://${path}/index.html`);

		window.on("closed", () => {
			window = null;
		});
	};
};
