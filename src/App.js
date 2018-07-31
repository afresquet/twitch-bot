import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { ipcRenderer } from "./helpers/react-electron";

export default class App extends Component {
	state = {
		features: []
	};

	componentDidMount() {
		ipcRenderer.send("requestFeatures");
		ipcRenderer.on("sendFeatures", (e, features) =>
			this.setState({ features })
		);
	}

	onDrop = files => {
		if (files.length > 1) {
			console.error("only folders");
			return;
		}
		ipcRenderer.send("folder", files[0].path);
	};

	openFeatureUI = name => () => ipcRenderer.send(name);

	render() {
		const { features } = this.state;
		return (
			<div>
				<h1>Twitch Bot</h1>
				{features.map(({ display, name }) => (
					<button type="button" onClick={this.openFeatureUI(name)} key={name}>
						{display}
					</button>
				))}
				<Dropzone onDrop={this.onDrop}>
					<h1>Drop</h1>
					<h1>files</h1>
					<h1>here</h1>
				</Dropzone>
			</div>
		);
	}
}
