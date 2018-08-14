import messageParser from "../../helpers/messageParser";
import isMod from "../../helpers/isMod";
import { addQuote, findQuote } from "./helpers/db";

export default Feature =>
	class Quotes extends Feature {
		constructor(settings) {
			super({
				name: "Quotes",
				icon: "ChatBubbleOutline",
				...settings
			});

			this.db.loadDatabase();
		}

		onChat = async (channel, userstate, message, self) => {
			try {
				if (self) return;

				const { command, rest, option, restAfterOption } = messageParser(
					message
				);

				if (command !== "!quote") return;

				if (option === "add") {
					if (!isMod(userstate) || !rest) return;

					const number = await addQuote(this.db, restAfterOption);

					this.bot.say(channel, `Quote #${number} added!`);

					return;
				}

				const number = parseInt(option, 10);

				const quote = await findQuote(this.db, !Number.isNaN(number) && number);

				this.bot.say(channel, quote);
			} catch (err) {
				this.bot.say(channel, err.message);
			}
		};
	};
