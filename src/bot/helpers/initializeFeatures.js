import { resolve, join } from "path";
import getDirectories from "./getDirectories";
import Feature from "../classes/Feature";
import Tools from "../classes/Tools";

/**
 * Takes a bot and adds features to it.
 * @param {Bot} bot The bot to modify.
 */
export default async function initializeFeatures(bot, mainWindow) {
	try {
		const sendToRenderer = (...args) => mainWindow.webContents.send(...args);

		const groups = await Promise.all([
			getDirectories(`${__dirname}/../features/core`),
			getDirectories(`${__dirname}/../features/addons`)
		]);

		const tools = new Tools();

		const features = groups.map(async directories =>
			Promise.all(
				directories.map(async directory => {
					const path = resolve(directory);

					const ExtendedFeature = await require(path).default(Feature);
					const feature = new ExtendedFeature({
						bot,
						tools,
						dbPath: join(path, "index.db")
					});

					if (feature.onChat.length) bot.on("chat", feature.onChat);

					return {
						name: feature.name,
						icon: feature.icon,
						prefix: feature.ipcMain.prefix,
						react: join(path, "react")
					};
				})
			)
		);

		const [core, addons] = await Promise.all(features);

		sendToRenderer("sendFeatures", { core, addons });

		return features;
	} catch (e) {
		console.log(e);

		return false;
	}
}
