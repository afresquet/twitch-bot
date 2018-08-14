import { onLoadData, onUpdateSettings } from "./callbacks/ipcMain";
import onChat from "./callbacks/onChat";

export default async ({
	bot,
	loadDB,
	createState,
	ipcMain,
	sendToRenderer
}) => {
	const featureData = {
		name: "Poll",
		icon: "Assignment"
	};

	try {
		const db = await loadDB();

		const initialState = {
			pollActive: false,
			poll: {},
			voters: []
		};
		const state = createState(initialState);

		ipcMain.on("load-data", onLoadData(db, state));

		ipcMain.on("update-settings", onUpdateSettings(db));

		bot.on("chat", onChat(bot, db, state, initialState, sendToRenderer));

		return featureData;
	} catch (error) {
		return {
			...featureData,
			error
		};
	}
};
