import * as dbMethods from "./helpers/db";

export default Feature =>
	class Magic8Ball extends Feature {
		static featureName = "Magic 8-Ball";
		static featureIcon = "GroupWork";

		options = ["add", "edit", "delete", "list"];

		onInitialize = () => {
			this.db.loadWithCustomMethods(dbMethods);

			this.ipcMain.on("get-answers", () =>
				this.manageAnswers(this.db.getAnswers)
			);
			this.ipcMain.on("new-answer", (_, answer) =>
				this.manageAnswers(this.db.addAnswer, answer)
			);
			this.ipcMain.on("edit-answer", (_, { oldAnswer, newAnswer }) =>
				this.manageAnswers(this.db.editAnswer, oldAnswer, newAnswer)
			);
			this.ipcMain.on("delete-answer", (_, answer) =>
				this.manageAnswers(this.db.deleteAnswer, answer)
			);
		};

		onChat = async (channel, userstate, message, self) => {
			try {
				if (self) return;

				const { command, option, restAfterOption } = this.tools.messageParser(
					message
				);

				if (command !== "!8ball") return;

				if (!this.options.find(opt => opt === option)) {
					const answers = await this.db.getAnswers();

					this.bot.say(channel, answers[this.tools.randomInt(answers.length)]);

					return;
				}

				if (!this.tools.isMod(userstate)) {
					this.bot.say(
						channel,
						"You don't have authorization to use that command."
					);
					return;
				}

				let response;

				if (option === "add") {
					if (!restAfterOption) return;

					await this.manageAnswers(this.db.addAnswer, restAfterOption);

					response = `Added "${restAfterOption}" as an answer.`;
				} else if (option === "edit") {
					const { command: number, rest: newAnswer } = this.tools.messageParser(
						restAfterOption
					);

					const index = parseInt(number, 10);

					if (Number.isNaN(index) || !newAnswer) return;

					await this.manageAnswers(this.db.editAnswer, index, newAnswer);

					response = `Edited option ${index} to be "${newAnswer}".`;
				} else if (option === "delete") {
					const index = parseInt(restAfterOption, 10);

					if (Number.isNaN(index)) return;

					await this.manageAnswers(this.db.deleteAnswer, index);

					response = `Deleted option ${index}.`;
				} else if (option === "list") {
					this.bot.whisper(userstate.username, await this.getAnswersList());
					return;
				}

				this.bot.say(channel, response);
			} catch (err) {
				this.bot.say(channel, err.message);
			}
		};

		manageAnswers = async (callback, ...args) =>
			this.ipcMain.send("answers", await callback(...args));

		getAnswersList = async () => {
			const answers = await this.db.getAnswers();

			return answers.reduce(
				(acc, answer, i) =>
					i === 0 ? `${i + 1}: ${answer}` : `${acc} ${i + 1}: ${answer}`,
				""
			);
		};
	};
