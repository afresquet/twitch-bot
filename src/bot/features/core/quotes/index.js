import { addQuote, findQuote } from "./helpers/db";

export default Feature =>
	class Quotes extends Feature {
		static featureName = "Quotes";
		static featureIcon = "ChatBubbleOutline";

		onInitialize = () => this.db.loadDatabase();

		onChat = async (channel, userstate, message, self) => {
			try {
				if (self) return;

				const {
					command,
					rest,
					option,
					restAfterOption
				} = this.tools.messageParser(message);

				if (command !== "!quote") return;

				if (option === "add") {
					if (!this.tools.isMod(userstate) || !rest) return;

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
