import { resolve, join } from "path";
import { client as Client } from "tmi.js";
import Datastore from "nedb";
import { ncp } from "ncp";
import Feature from "./classes/Feature";
import { getDirectories, isDirectory } from "./helpers/directories";
import randomHash from "./helpers/randomHash";

export default class Bot extends Client {
	constructor(userData, botData) {
		super({
			options: { debug: true },
			connection: {
				secure: true,
				reconnect: true
			},
			identity: {
				username: botData.account,
				password: `oauth:${botData.password}`
			},
			channels: [userData.account]
		});

		this.mainUserChannel = userData.account;
	}

	features = {
		core: [],
		addons: []
	};

	initialize = async () => {
		try {
			await this.loadFeatures();

			this.on("connected", () =>
				this.action(this.mainUserChannel, "is up and running...")
			);

			this.connect();
		} catch (err) {
			throw err;
		}
	};

	loadFeatures = async () =>
		new Promise((res, rej) => {
			[
				[`${__dirname}/features/core`, [false, "core"]],
				[`${__dirname}/features/addons`, []]
			].forEach(async ([featuresPath, args]) => {
				try {
					(await getDirectories(featuresPath)).forEach(async directory => {
						try {
							const path = resolve(directory);

							await this.addFeature(path, ...args);
						} catch (err) {
							rej(err);
						}
					});
					res();
				} catch (err) {
					rej(err);
				}
			});
		});

	addFeature = async (originalPath, move = false, type = "addons") => {
		const path = move ? await this.moveFeature(originalPath) : originalPath;

		const ExtendedFeature = await require(path).default(Feature);

		if (!Object.isPrototypeOf.call(Feature, ExtendedFeature))
			this.features[type].push({
				error: new Error(
					`The feature at ${path} does not extend the class Feature`
				)
			});

		const feature = new ExtendedFeature({
			bot: this,
			db: new Datastore(join(path, "index.db"))
		});

		feature.onInitialize();

		if (feature.onChat.length) this.on("chat", feature.onChat);

		const featureData = {
			name: ExtendedFeature.featureName,
			icon: ExtendedFeature.featureIcon,
			prefix: feature.ipcMain.prefix,
			react: join(path, "react")
		};

		this.features[type].push(featureData);
	};

	moveFeature = from =>
		new Promise((res, rej) => {
			try {
				const hash = randomHash(5);

				const splitPath = from.split("/");

				const to = `${__dirname}/features/addons/${hash}-${
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

	validateFeature = async path => {
		if (!isDirectory(path)) throw new Error("The feature should be a folder");

		const ExtendedFeature = await require(path).default(Feature);

		if (!Object.isPrototypeOf.call(Feature, ExtendedFeature))
			throw new Error("The feature does not extend the class Feature");

		return ExtendedFeature.featureName;
	};
}
