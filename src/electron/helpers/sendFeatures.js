import state from "../AppState";

export default function sendFeatures() {
	if (!state.features) return;

	state.mainWindow.webContents.send("features", state.features);
}
