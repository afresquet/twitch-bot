import messageParser from "../../../../helpers/messageParser";
import { loadSettings } from "../helpers/db";
import clamp from "../helpers/clamp";

export default async function onChat(
	channel,
	{ "user-id": userId },
	message,
	self
) {
	if (self) return;

	if (!this.state.pollActive) {
		if (message === "!poll help") {
			const settings = await loadSettings(this.db);

			this.bot.say(
				channel,
				`The syntax to write a poll should be "!poll {question} - {option, option, option} - {time}" with as many options as you want (minimum 2), and time in seconds as a number (minimum ${
					settings.minSeconds
				} and maximum ${settings.maxSeconds}).`
			);

			return;
		}

		const { command, rest } = messageParser(message);

		if (command !== "!poll") return;

		const [question, optionsGroup, seconds] = rest.split(" - ");

		if (
			!question ||
			!optionsGroup ||
			!seconds ||
			Number.isNaN(parseInt(seconds, 10))
		)
			return;

		const settings = await loadSettings(this.db);

		const time = clamp(
			parseInt(seconds, 10),
			settings.minSeconds,
			settings.maxSeconds
		);

		const options = optionsGroup.split(", ");
		if (options.length <= 1) return;

		this.updateState({
			pollActive: true,
			poll: options.reduce((acc, option) => {
				acc[option.toLowerCase()] = 0;

				return acc;
			}, {})
		});

		this.bot.say(
			channel,
			`New poll running for ${time} seconds: ${question} - Possible answers are: ${options.reduce(
				(acc, option) => `${acc}, ${option}`
			)}.`
		);

		this.ipcMain.send("poll-active", this.state.poll);

		setTimeout(() => {
			this.ipcMain.send("poll-inactive");

			if (this.state.voters.length === 0) {
				this.bot.say(channel, "Poll ended with no votes, you boring fucks.");

				this.updateState(this.initialState);

				return;
			}

			const resultsString = Object.entries(this.state.poll).reduce(
				(acc, [key, value]) =>
					acc ? `${acc}, ${key} [${value}]` : `${key} [${value}]`,
				""
			);
			this.bot.say(channel, `Poll ended, results were: ${resultsString}`);

			this.updateState(this.initialState);
		}, time * 1000);
	} else {
		const vote = message.toLowerCase();

		if (
			this.state.voters.find(voter => voter === userId) ||
			!Object.prototype.hasOwnProperty.call(this.state.poll, vote)
		)
			return;

		this.updateState({
			poll: {
				...this.state.poll,
				[vote]: this.state.poll[vote] + 1
			},
			voters: [...this.state.voters, userId]
		});
	}
}
