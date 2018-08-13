import messageParser from "../../helpers/messageParser";
import clamp from "./helpers/clamp";

export default ({ bot, createState }) => {
	const featureData = {
		name: "Poll",
		icon: "Assignment"
	};

	try {
		const initialState = {
			pollActive: false,
			poll: {},
			voters: []
		};
		const state = createState(initialState);

		bot.on("chat", (channel, { "user-id": userId }, message, self) => {
			if (self) return;

			if (!state.data.pollActive) {
				if (message === "!poll help") {
					bot.say(
						channel,
						'The syntax to write a poll should be "!poll {question} - {option, option, option} - {time}" with as many options as you want (minimum 2), and time in seconds as a number (minimum 15 and maximum 60).'
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

				const time = clamp(parseInt(seconds, 10), 15, 60);

				const options = optionsGroup.split(", ");
				if (options.length <= 1) return;

				state.update({
					pollActive: true,
					poll: options.reduce((acc, option) => {
						acc[option.toLowerCase()] = 0;

						return acc;
					}, {})
				});

				bot.say(
					channel,
					`New poll running for ${time} seconds: ${question} - Possible answers are: ${options.reduce(
						(acc, option) => `${acc}, ${option}`
					)}.`
				);

				setTimeout(() => {
					if (state.data.voters.length === 0) {
						bot.say(channel, "Poll ended with no votes, you boring fucks.");

						state.update(initialState);

						return;
					}

					const resultsString = Object.entries(state.data.poll).reduce(
						(acc, [key, value]) =>
							acc ? `${acc}, ${key} [${value}]` : `${key} [${value}]`,
						""
					);
					bot.say(channel, `Poll ended, results were: ${resultsString}`);

					state.update(initialState);
				}, time * 1000);
			} else {
				const vote = message.toLowerCase();

				if (
					state.data.voters.find(voter => voter === userId) ||
					!Object.prototype.hasOwnProperty.call(state.data.poll, vote)
				)
					return;

				state.update({
					poll: {
						...state.data.poll,
						[vote]: state.data.poll[vote] + 1
					},
					voters: [...state.data.voters, userId]
				});
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
