import { resolve, join } from "path";
import getDirectories from "./getDirectories";
import Feature from "../classes/Feature";

/**
 * Takes a bot and adds features to it.
 * @param {Bot} bot The bot to modify.
 */
export default async function initializeFeatures(bot, mainWindow) {
	try {
		const sendToRenderer = (...args) => mainWindow.webContents.send(...args);

		const directories = await getDirectories(`${__dirname}/../features`);

		const features = directories.map(async directory => {
			const path = resolve(directory);

			const ExtendedFeature = await require(path).default(Feature);
			const feature = new ExtendedFeature({
				bot,
				dbPath: join(path, "index.db")
			});

			bot.on("chat", feature.onChat);

			return {
				name: feature.name,
				icon: feature.icon,
				prefix: feature.ipcMain.prefix,
				react: join(path, "react.js")
			};
		});

		sendToRenderer("sendFeatures", await Promise.all(features));

		return features;
	} catch (e) {
		console.log(e);

		return false;
	}
}
