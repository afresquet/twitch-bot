import seedrandom from "seedrandom";
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

			const { command, rest: seed } = this.tools.messageParser(message);

			if (command !== "!sortinghat") return;

			const house = this.seededInt(seed || userId, this.quotes.length);
			const houseQuotes = this.quotes[house];
			const chosenQuote = houseQuotes[this.tools.randomInt(houseQuotes.length)];

			this.bot.say(channel, `${seed || username} ${chosenQuote}`);
		};

		seededInt = (seed, range = 10) =>
			Math.floor(seedrandom(seed)() * Math.floor(range));
	};
