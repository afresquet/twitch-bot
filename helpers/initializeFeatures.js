/* eslint-disable global-require,import/no-dynamic-require */
import { resolve } from "path";
import getDirectories from "./getDirectories";

/**
 * Takes a bot and adds features to it.
 * @param {Bot} bot The bot to modify.
 */
export default async bot => {
	try {
		const features = await getDirectories("./bot/features");

		features.forEach(path => require(resolve(path))(bot));
	} catch (e) {
		console.log(e);
	}
};
