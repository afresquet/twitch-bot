import React, { Component } from "react";
import { ipcRenderer } from "./helpers/electron";

class App extends Component {
	state = {
		features: []
	};

	componentDidMount = () => {
		ipcRenderer.send("requestFeatures");
		ipcRenderer.on("sendFeatures", (e, features) =>
			this.setState({ features })
		);
	};

	openFeatureUI = name => () => ipcRenderer.send(name);

	render() {
		const { features } = this.state;
		return (
			<div>
				<h1>Twitch Bot</h1>
				{features.map(({ display, name }) => (
					<button type="button" onClick={this.openFeatureUI(name)}>
						{display}
					</button>
				))}
			</div>
		);
	}
}

export default App;
