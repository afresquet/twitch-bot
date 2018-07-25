import bot from "./client";

bot.on("connected", () =>
	bot.action(process.env.CHANNEL, "is up and running...")
);

bot.on("chat", (channel, userstate, message, self) => {
	if (self) return;

	bot.say(channel, message);
});

export default bot;
