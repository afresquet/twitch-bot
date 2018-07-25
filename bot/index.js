import bot from "./client";
import initializeFeatures from "../helpers/initializeFeatures";

initializeFeatures(bot);

bot.on("connected", () =>
	bot.action(process.env.CHANNEL, "is up and running...")
);

export default bot;
