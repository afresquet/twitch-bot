import { resolve, join } from "path";
import { ncp } from "ncp";
import Datastore from "nedb";
import app from "../../electron/AppState";
import { getDirectories, isDirectory } from "./directories";
import randomHash from "./randomHash";
import Feature from "../classes/Feature";

export async function validateFeature(path) {
	if (!isDirectory(path)) throw new Error("The feature should be a folder");

	const ExtendedFeature = await require(path).default(Feature);

	if (!Object.isPrototypeOf.call(Feature, ExtendedFeature))
		throw new Error("The feature does not extend the class Feature");

	return ExtendedFeature.featureName;
}

export function moveFeature(from) {
	return new Promise((res, rej) => {
		try {
			const hash = randomHash(5);

			const splitPath = from.split("/");

			const to = `${__dirname}/../features/addons/${hash}-${
				splitPath[splitPath.length - 1]
			}`;

			ncp(from, to, err => {
				if (err) {
					rej(err);
					return;
				}

				res(to);
			});
		} catch (err) {
			rej(err);
		}
	});
}

export async function addFeature(originalPath, move = false) {
	const path = move ? await moveFeature(originalPath) : originalPath;

	const ExtendedFeature = await require(path).default(Feature);

	if (!Object.isPrototypeOf.call(Feature, ExtendedFeature))
		return {
			error: new Error("The feature does not extend the class Feature")
		};

	const feature = new ExtendedFeature({
		bot: app.bot,
		db: new Datastore(join(path, "index.db"))
	});

	feature.onInitialize();

	if (feature.onChat.length) app.bot.on("chat", feature.onChat);

	return {
		name: ExtendedFeature.featureName,
		icon: ExtendedFeature.featureIcon,
		prefix: feature.ipcMain.prefix,
		react: join(path, "react")
	};
}

export async function initializeFeatures() {
	try {
		const groups = await Promise.all([
			getDirectories(`${__dirname}/../features/core`),
			getDirectories(`${__dirname}/../features/addons`)
		]);

		const features = groups.map(async directories =>
			Promise.all(
				directories.map(async directory => {
					const path = resolve(directory);

					return addFeature(path);
				})
			)
		);

		const [core, addons] = await Promise.all(features);

		return { core, addons };
	} catch (err) {
		throw err;
	}
}
