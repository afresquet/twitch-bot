import { loadSettings, editSettings } from "../helpers/db";

export const onLoadData = (db, state) => async e => {
	const settings = await loadSettings(db);

	e.sender.send("data", {
		state: {
			...state.data,
			voters: state.data.voters.length
		},
		settings
	});
};

export const onUpdateSettings = db => async (e, newSettings) => {
	await editSettings(db, newSettings);

	e.sender.send("settings-updated");
};
