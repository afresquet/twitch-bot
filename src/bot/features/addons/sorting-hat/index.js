import messageParser from "../../../helpers/messageParser";
import { seededInt, randomInt } from "./helpers/random";
import quotesJSON from "./quotes.json";

export default Feature =>
	class SortingHat extends Feature {
		constructor(settings) {
			super({
				name: "Sorting Hat",
				icon: "Visibility",
				...settings
			});

			this.quotes = Object.values(quotesJSON);
		}

		onChat = (channel, { username, "user-id": userId }, message, self) => {
			if (self) return;

			const { command, rest: seed } = messageParser(message);

			if (command !== "!sortinghat") return;

			const house = seededInt(seed || userId, this.quotes.length);
			const houseQuotes = this.quotes[house];
			const chosenQuote = houseQuotes[randomInt(houseQuotes.length)];

			this.bot.say(channel, `${seed || username} ${chosenQuote}`);
		};
	};
