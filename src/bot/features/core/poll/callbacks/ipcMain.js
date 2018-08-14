import { loadSettings, editSettings } from "../helpers/db";

export async function onLoadData() {
	const settings = await loadSettings(this.db);

	this.ipcMain.send("data", {
		state: {
			...this.state,
			voters: this.state.voters.length
		},
		settings
	});
}

export async function onUpdateSettings(_, newSettings) {
	await editSettings(this.db, newSettings);

	this.ipcMain.send("settings-updated");
}
