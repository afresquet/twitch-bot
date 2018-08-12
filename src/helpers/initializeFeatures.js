import { resolve, join } from "path";
import { ipcMain } from "electron";
import getDirectories from "./getDirectories";
import createDBLoader from "./createDBLoader";

/**
 * Takes a bot and adds features to it.
 * @param {Bot} bot The bot to modify.
 */
export default async bot => {
	try {
		const directories = await getDirectories(`${__dirname}/../bot/features`);

		const features = directories.map(async directory => {
			const path = resolve(directory);

			const dbLoader = createDBLoader(join(path, "index.db"));

			const feature = require(path);
			const featureData = await feature(bot, dbLoader);

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
};
