export default class PublicClient {
	constructor(bot) {
		this.commands.forEach(command => {
			this[command] = bot[command].bind(bot);
		});
	}

	commands = [
		"on",
		"api",

		"action",
		"ban",
		"clear",
		"color",
		"commercial",
		"emoteonly",
		"emoteonlyoff",
		"followersonly",
		"followersonlyoff",
		"mod",
		"mods",
		"ping",
		"r9kbeta",
		"r9kbetaoff",
		"raw",
		"say",
		"slow",
		"slowoff",
		"subscribers",
		"subscribersoff",
		"timeout",
		"unban",
		"unmod",
		"whisper"
	];
}
