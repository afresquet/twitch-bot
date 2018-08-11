import messageParser from "../../../helpers/messageParser";
import { addQuote, findQuote } from "./helpers/db";

module.exports = (bot, db) => {
	db.loadDatabase(err => err && console.log(err));

	bot.on("chat", async (channel, { mod, badges }, message, self) => {
		try {
			if (self) return;

			const { command, rest } = messageParser(message);

			switch (command) {
				case "!quote": {
					const number = parseInt(rest.split(" ")[0], 10);

					const quote = await findQuote(db, !Number.isNaN(number) && number);

					bot.say(channel, quote);

					break;
				}

				case "!addquote": {
					if (!(badges.broadcaster || mod) || !rest) return;

					const number = await addQuote(db, rest);

					bot.say(channel, `Quote #${number} added!`);

					break;
				}

				default:
					break;
			}
		} catch (err) {
			bot.say(channel, err.message);
		}
	});

	return {
		name: "Quotes",
		icon: "ChatBubbleOutline"
	};
};
