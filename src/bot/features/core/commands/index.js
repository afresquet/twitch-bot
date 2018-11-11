import * as dbMethods from "./helpers/db";

export default Feature =>
	class Commands extends Feature {
		static featureName = "Commands";
		static featureIcon = "";

		onInitialize = () => {
			this.db.loadWithCustomMethods(dbMethods);

			this.ipcMain.on("get-commands", this.sendAllCommands);
			this.ipcMain.on("edit-command", (_, { commandToEdit, newMessage }) => {
				this.editCommand(commandToEdit, newMessage);
				this.sendAllCommands();
			});
			this.ipcMain.on("delete-command", (_, commandToDelete) => {
				this.editCommand(commandToDelete);
				this.sendAllCommands();
			});
		};

		options = ["add", "edit", "delete"];

		onChat = async (channel, userstate, message, self) => {
			try {
				if (self) return;

				const { command, option, restAfterOption } = this.tools.messageParser(
					message
				);

				const commandMessage = await this.getCommand(command);

				if (commandMessage) {
					this.bot.say(channel, commandMessage);

					return;
				}

				if (command !== "!command" || !this.options.find(opt => opt === option))
					return;

				if (!this.tools.isMod(userstate)) {
					this.bot.say(
						channel,
						"You don't have authorization to use that command."
					);
					return;
				}

				const { command: cmd, rest: msg } = this.tools.messageParser(
					restAfterOption
				);

				if (!cmd || !msg) return;

				if (option === "add") {
					await this.addCommand(cmd, msg);

					this.bot.say(channel, `Command ${cmd} added!`);
				} else if (option === "edit") {
					await this.editCommand(cmd, msg);

					this.bot.say(channel, `Command ${cmd} edited!`);
				} else if (option === "delete") {
					await this.deleteCommand(cmd);

					this.bot.say(channel, `Command ${cmd} deleted!`);
				}
			} catch (err) {
				this.bot.say(channel, err.message);
			}
		};

		getCommand = command => this.db.getCommand(command);

		addCommand = (command, message) => this.db.addCommand(command, message);
		editCommand = (command, message) => this.db.editCommand(command, message);
		deleteCommand = command => this.db.deleteCommand(command);

		sendAllCommands = async () => {
			const commands = await this.db.getAllCommands();

			this.ipcMain.send("commands", commands);
		};
	};
