import { client as Client } from "tmi.js";

export default function createClient(userData, botData) {
	return new Client({
		options: { debug: true },
		connection: {
			secure: true,
			reconnect: true
		},
		identity: {
			username: botData.account,
			password: `oauth:${botData.password}`
		},
		channels: [userData.account, "vessed"]
	});
}
