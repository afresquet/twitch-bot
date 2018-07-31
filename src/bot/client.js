import { client as Client } from "tmi.js";
import dotenv from "dotenv";

dotenv.config();

export default new Client({
	options: { debug: true },
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: process.env.BOT_USERNAME,
		password: `oauth:${process.env.BOT_PASSWORD}`
	},
	channels: [process.env.CHANNEL]
});
