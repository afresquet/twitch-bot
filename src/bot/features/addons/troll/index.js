export default Feature =>
	class Troll extends Feature {
		constructor(settings) {
			super({
				name: "Troll",
				icon: "Whatshot",
				...settings
			});

			this.words = ["I'm", "I’m", "Im", "I am"];
		}

		parseString = string => {
			const newString = string.replace(this.regex, "");

			return this.regex.test(newString)
				? this.parseString(newString)
				: newString;
		};

		get regex() {
			return RegExp(
				`^(${this.words.reduce((acc, word) => `${acc}|${word}`)})\\s`,
				"i"
			);
		}

		onChat = (channel, userstate, message, self) => {
			if (self || !this.regex.test(message)) return;

			const content = this.parseString(message);

			this.bot.say(channel, `Hello ${content} - I'm ${this.bot.username}.`);
		};
	};
