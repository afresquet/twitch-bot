import React, { Component } from "react";
import { ipcRenderer } from "./helpers/react-electron";
import AsyncComponent from "./react/components/helpers/AsyncComponent";

export default class App extends Component {
	state = {
		features: [],
		featurePath: null
	};

	componentDidMount() {
		ipcRenderer.send("requestFeatures");
		ipcRenderer.on("sendFeatures", (e, features) =>
			this.setState({ features })
		);
	}

	openFeatureUI = react => () => this.setState({ featurePath: react });

	render() {
		const { features, featurePath } = this.state;

		return (
			<div>
				<h1>Twitch Bot</h1>
				{features.map(({ display, name, react }) => (
					<button type="button" onClick={this.openFeatureUI(react)} key={name}>
						{display}
					</button>
				))}
				{featurePath && <AsyncComponent path={featurePath} />}
			</div>
		);
	}
}
