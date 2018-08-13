import messageParser from "../../helpers/messageParser";
import isMod from "../../helpers/isMod";
import { addQuote, findQuote } from "./helpers/db";

export default async ({ bot, loadDB }) => {
	const featureData = {
		name: "Quotes",
		icon: "ChatBubbleOutline"
	};

	try {
		const db = await loadDB();

		bot.on("chat", async (channel, userstate, message, self) => {
			try {
				if (self) return;

				const { command, rest, option, restAfterOption } = messageParser(
					message
				);

				if (command !== "!quote") return;

				if (option === "add") {
					if (!isMod(userstate) || !rest) return;

					const number = await addQuote(db, restAfterOption);

					bot.say(channel, `Quote #${number} added!`);

					return;
				}

				const number = parseInt(option, 10);

				const quote = await findQuote(db, !Number.isNaN(number) && number);

				bot.say(channel, quote);
			} catch (err) {
				bot.say(channel, err.message);
			}
		});

		return featureData;
	} catch (error) {
		return {
			...featureData,
			error
		};
	}
};
