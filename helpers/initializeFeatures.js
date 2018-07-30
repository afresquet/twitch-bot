import { resolve, join } from "path";
import Datastore from "nedb";
import { ipcMain } from "electron";
import getDirectories from "./getDirectories";
import createUIWindow from "./createUIWindow";

/**
 * Takes a bot and adds features to it.
 * @param {Bot} bot The bot to modify.
 */
export default async bot => {
	try {
		const features = await getDirectories("./bot/features");

		const ui = features.map(({ name, directory }) => {
			const path = resolve(directory);

			const db = new Datastore(join(path, "index.db"));

			/* eslint-disable-next-line global-require,import/no-dynamic-require */
			const display = require(path)(bot, db);

			ipcMain.on(name, createUIWindow(path, { width: 500, height: 500 }));

			return {
				name,
				display
			};
		});

		ipcMain.on("requestFeatures", e => e.sender.send("sendFeatures", ui));
	} catch (e) {
		console.log(e);
	}
};
