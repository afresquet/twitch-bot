import keytar from "keytar";
import state from "../electron/AppState";
import createClient from "./client";
import { initializeFeatures } from "./helpers/features";

export default async function loadBot() {
	try {
		const [userCredentials] = await keytar.findCredentials("TwitchBot_User");
		const [botCredentials] = await keytar.findCredentials("TwitchBot_Bot");

		const bot = createClient(userCredentials, botCredentials);

		const features = await initializeFeatures(bot);

		bot.on("connected", () =>
			bot.action(userCredentials.account, "is up and running...")
		);

		state.set("bot", bot);
		state.set("features", features);
	} catch (err) {
		throw err;
	}
}
