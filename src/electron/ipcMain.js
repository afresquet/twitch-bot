import { ipcMain, dialog } from "electron";
import app from "./AppState";
import { addFeature, validateFeature } from "../bot/helpers/features";

export default function setupIPCMain() {
	ipcMain.on("requestFeatures", app.sendFeatures);

	ipcMain.on("new-feature", async (e, path) => {
		try {
			const name = await validateFeature(path);

			e.sender.send("new-feature-response", name);

			ipcMain.once("new-feature-confirmation", async (_, confirmed) => {
				if (!confirmed) return;

				const feature = await addFeature(path, true);

				app.addFeature(feature);

				app.sendFeatures();
			});
		} catch ({ message, stack }) {
			dialog.showErrorBox(message, stack);
		}
	});
}
