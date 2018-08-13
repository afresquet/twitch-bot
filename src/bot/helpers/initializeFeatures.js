import { resolve, join } from "path";
import { ipcMain } from "electron";
import getDirectories from "./getDirectories";
import createDBLoader from "./createDBLoader";
import State from "./State";

/**
 * Takes a bot and adds features to it.
 * @param {Bot} bot The bot to modify.
 */
export default async function initializeFeatures(bot) {
	try {
		const directories = await getDirectories(`${__dirname}/../features`);

		const features = directories.map(async directory => {
			const path = resolve(directory);

			const feature = require(path).default;
			const featureData = await feature({
				bot,
				loadDB: createDBLoader(join(path, "index.db")),
				createState: initialState => new State(initialState)
			});

			return {
				...featureData,
				react: join(path, "react.js")
			};
		});

		ipcMain.on("requestFeatures", async e =>
			e.sender.send("sendFeatures", await Promise.all(features))
		);
	} catch (e) {
		console.log(e);
	}
}
