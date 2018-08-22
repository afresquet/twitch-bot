import * as dbMethods from "./helpers/db";

export default Feature =>
	class Poll extends Feature {
		static featureName = "Poll";
		static featureIcon = "Assignment";

		initialState = {
			poll: {
				active: false,
				question: "",
				options: {},
				voters: []
			}
		};

		state = this.initialState;

		onInitialize = () => {
			this.db.loadWithCustomMethods(dbMethods);

			this.ipcMain.on("load-data", this.onLoadData);
			this.ipcMain.on("update-settings", this.onUpdateSettings);
		};

		onLoadData = async () => {
			const { _id, ...settings } = await this.db.loadSettings();
			const { voters, ...poll } = this.state.poll;

			this.ipcMain.send("data", { poll, settings });
		};

		onUpdateSettings = async (_, newSettings) => {
			await this.db.editSettings(newSettings);

			this.ipcMain.send("settings-updated");
		};

		onChat = async (channel, { "user-id": userId }, message, self) => {
			if (self) return;

			if (!this.state.poll.active) {
				if (message === "!poll help") {
					const settings = await this.db.loadSettings();

					this.bot.say(
						channel,
						`The syntax to write a poll should be "!poll {question} - {option, option, option} - {time}" with as many options as you want (minimum 2), and time in seconds as a number (minimum ${
							settings.minSeconds
						} and maximum ${settings.maxSeconds}).`
					);

					return;
				}

				const { command, rest } = this.tools.messageParser(message);

				if (command !== "!poll") return;

				const [question, optionsGroup, seconds] = rest.split(" - ");

				if (
					!question ||
					!optionsGroup ||
					!seconds ||
					Number.isNaN(parseInt(seconds, 10))
				)
					return;

				const settings = await this.db.loadSettings();

				const time = this.tools.clamp(
					parseInt(seconds, 10),
					settings.minSeconds,
					settings.maxSeconds
				);

				const options = optionsGroup.split(", ");
				if (options.length <= 1) return;

				this.startPoll(channel, question, options, time);

				setTimeout(this.endPoll(channel), time * 1000);
			} else {
				this.addVote(message.toLowerCase(), userId);
			}
		};

		startPoll = (channel, question, options, time) => {
			this.updateState({
				poll: {
					active: true,
					question,
					options: options.reduce((acc, option) => {
						acc[option.toLowerCase()] = 0;

						return acc;
					}, {}),
					voters: []
				}
			});

			this.bot.say(
				channel,
				`New poll running for ${time} seconds: ${question} - Possible answers are: ${options.reduce(
					(acc, option) => `${acc}, ${option}`
				)}.`
			);

			this.ipcMain.send("poll-active", {
				question,
				options: this.state.poll.options
			});
		};

		addVote = (vote, userId) => {
			if (
				this.state.poll.voters.find(voter => voter === userId) ||
				!Object.prototype.hasOwnProperty.call(this.state.poll.options, vote)
			)
				return;

			this.updateState({
				poll: {
					...this.state.poll,
					options: {
						...this.state.poll.options,
						[vote]: this.state.poll.options[vote] + 1
					},
					voters: [...this.state.poll.voters, userId]
				}
			});

			this.ipcMain.send("new-vote", vote);
		};

		endPoll = channel => () => {
			this.ipcMain.send("poll-inactive");

			this.updateState({
				poll: {
					...this.state.poll,
					active: false
				}
			});

			if (this.state.poll.voters.length === 0) {
				this.bot.say(channel, "Poll ended with no votes, you boring fucks.");
				return;
			}

			const resultsString = Object.entries(this.state.poll.options).reduce(
				(acc, [key, value]) =>
					acc ? `${acc}, ${key} [${value}]` : `${key} [${value}]`,
				""
			);
			this.bot.say(channel, `Poll ended, results were: ${resultsString}`);
		};
	};
