import { resolve, join } from "path";
import Datastore from "nedb";
import { ipcMain } from "electron";
import getDirectories from "./getDirectories";

/**
 * Takes a bot and adds features to it.
 * @param {Bot} bot The bot to modify.
 */
export default async bot => {
	try {
		const features = await getDirectories(`${__dirname}/../bot/features`);

		const ui = features.map(async ({ name, directory }) => {
			const path = resolve(directory);

			const db = new Datastore(join(path, "index.db"));

			const display = await require(path)(bot, db);

			return {
				name,
				display,
				react: join(path, "react.js")
			};
		});

		ipcMain.on("requestFeatures", async e =>
			e.sender.send("sendFeatures", await Promise.all(ui))
		);
	} catch (e) {
		console.log(e);
	}
};
