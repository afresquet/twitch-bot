const electron = window.require("electron");

export default electron;
export const { ipcRenderer } = electron;
export const fs = electron.remote.require("fs");
