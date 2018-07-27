import { resolve, join } from "path";
import Datastore from "nedb";
import getDirectories from "./getDirectories";

/**
 * Takes a bot and adds features to it.
 * @param {Bot} bot The bot to modify.
 */
export default async bot => {
	try {
		const features = await getDirectories("./bot/features");

		features.forEach(directory => {
			const path = resolve(directory);

			const db = new Datastore(join(path, "index.db"));

			/* eslint-disable-next-line global-require,import/no-dynamic-require */
			require(path)(bot, db);
		});
	} catch (e) {
		console.log(e);
	}
};
