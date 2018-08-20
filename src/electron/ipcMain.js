import { ipcMain, dialog } from "electron";
import state from "./AppState";
import { addFeature, validateFeature } from "../bot/helpers/features";
import sendFeatures from "./helpers/sendFeatures";

export default function setupIPCMain() {
	ipcMain.on("requestFeatures", sendFeatures);

	ipcMain.on("new-feature", async (e, path) => {
		try {
			const name = await validateFeature(path);

			e.sender.send("new-feature-response", name);

			ipcMain.once("new-feature-confirmation", async (_, confirmed) => {
				if (!confirmed) return;

				const feature = await addFeature(state.bot, path, true);

				state.addFeature(feature);

				sendFeatures();
			});
		} catch ({ message, stack }) {
			dialog.showErrorBox(message, stack);
		}
	});
}
