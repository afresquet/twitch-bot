import seedrandom from "seedrandom";
import quotesJSON from "./quotes.json";

export default Feature =>
	class SortingHat extends Feature {
		static featureName = "Sorting Hat";
		static featureIcon = "Visibility";

		quotes = Object.values(quotesJSON);

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
