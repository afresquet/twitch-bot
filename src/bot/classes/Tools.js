class Tools {
	/**
	 * @description Parses a message and returns different slices of it.
	 * @param {string} message The message to parse.
	 */
	messageParser = message => {
		const [command] = message.split(" ", 1);
		const rest = message.slice(command.length + 1);

		const [option] = rest.split(" ", 1);
		const restAfterOption = message.slice(`${command} ${option} `.length);

		return { command, rest, option, restAfterOption };
	};

	/**
	 * @description Checks whether a given userstate is a mod or not.
	 * @param {Object} userstate Userstate object.
	 */
	isMod = ({ badges, mod }) => (badges && !!badges.broadcaster) || mod;

	/**
	 * @description Gives you a random int between a given range.
	 * @param {number} [range] Defines the range from 0 to (not including) X, defaults to 10.
	 */
	randomInt = (range = 10) => Math.floor(Math.random() * Math.floor(range));

	/**
	 * @description Clamps a number between a range.
	 * @param {number} number The number to apply the clamp to.
	 * @param {number} min The lowest number it can be.
	 * @param {number} max The lowest number it can be.
	 */
	clamp = (number, min, max) => Math.min(Math.max(number, min), max);
}

export default new Tools();
