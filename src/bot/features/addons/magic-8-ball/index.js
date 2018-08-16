import { getAnswers, addAnswer, deleteAnswer, editAnswer } from "./helpers/db";

export default Feature =>
	class Magic8Ball extends Feature {
		constructor(settings) {
			super({
				name: "Magic 8-Ball",
				icon: "GroupWork",
				...settings
			});

			this.db.loadDatabase();

			this.ipcMain.on("get-answers", () => this.manageAnswers(getAnswers));
			this.ipcMain.on("new-answer", (_, answer) =>
				this.manageAnswers(addAnswer, answer)
			);
			this.ipcMain.on("edit-answer", (_, { oldAnswer, newAnswer }) =>
				this.manageAnswers(editAnswer, oldAnswer, newAnswer)
			);
			this.ipcMain.on("delete-answer", (_, answer) =>
				this.manageAnswers(deleteAnswer, answer)
			);
		}

		options = ["add", "edit", "delete", "list"];

		onChat = async (channel, userstate, message, self) => {
			try {
				if (self) return;

				const { command, option, restAfterOption } = this.tools.messageParser(
					message
				);

				if (command !== "!8ball") return;

				if (!this.options.find(opt => opt === option)) {
					const answers = await getAnswers(this.db);

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

					await this.manageAnswers(addAnswer, restAfterOption);

					response = `Added "${restAfterOption}" as an answer.`;
				} else if (option === "edit") {
					const { command: number, rest: newAnswer } = this.tools.messageParser(
						restAfterOption
					);

					const index = parseInt(number, 10);

					if (Number.isNaN(index) || !newAnswer) return;

					await this.manageAnswers(editAnswer, index, newAnswer);

					response = `Edited option ${index} to be "${newAnswer}".`;
				} else if (option === "delete") {
					const index = parseInt(restAfterOption, 10);

					if (Number.isNaN(index)) return;

					await this.manageAnswers(deleteAnswer, index);

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
			this.ipcMain.send("answers", await callback(this.db, ...args));

		getAnswersList = async () => {
			const answers = await getAnswers(this.db);

			return answers.reduce(
				(acc, answer, i) =>
					i === 0 ? `${i + 1}: ${answer}` : `${acc} ${i + 1}: ${answer}`,
				""
			);
		};
	};
