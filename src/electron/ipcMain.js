import { ipcMain, dialog } from "electron";
import app from "./AppState";

export default function setupIPCMain() {
	ipcMain.on("requestFeatures", app.sendFeatures);

	ipcMain.on("new-feature", async (e, path) => {
		try {
			const name = await app.bot.validateFeature(path);

			e.sender.send("new-feature-response", name);

			ipcMain.once("new-feature-confirmation", async (_, confirmed) => {
				if (!confirmed) return;

				await app.bot.addFeature(path, true);

				app.sendFeatures();
			});
		} catch ({ message, stack }) {
			dialog.showErrorBox(message, stack);
		}
	});
}
