module.exports = bot => {
	bot.on("chat", (channel, userstate, message, self) => {
		if (self) return;

		if (message === "!quote") bot.say(channel, "this is a quote");
	});
};
