import keytar from "keytar";
import createClient from "./client";
import initializeFeatures from "./helpers/initializeFeatures";

export default async function loadBot() {
	try {
		const [userCredentials] = await keytar.findCredentials("TwitchBot_User");
		const [botCredentials] = await keytar.findCredentials("TwitchBot_Bot");

		const bot = createClient(userCredentials, botCredentials);

		const features = await initializeFeatures(bot);

		bot.on("connected", () =>
			bot.action(userCredentials.account, "is up and running...")
		);

		return [bot, features];
	} catch (err) {
		throw err;
	}
}
