import React, { Component } from "react";
import { ipcRenderer } from "./helpers/react-electron";

import TopBar from "./react/components/navigation/TopBar";
import SideBar from "./react/components/navigation/SideBar";
import AsyncComponent from "./react/components/helpers/AsyncComponent";

const styles = {
	cointainer: {
		display: "grid",
		gridTemplateColumns: "210px auto"
	},
	topBar: { gridColumn: "1 / -1" },
	sideBar: { height: "100vh" },
	main: { height: "100%", width: "100%" }
};

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

	showFeatureUI = react => () => this.setState({ featurePath: react });

	render() {
		const { features, featurePath } = this.state;

		return (
			<div style={styles.cointainer}>
				<TopBar style={styles.topBar} />

				<SideBar
					features={features}
					showFeatureUI={this.showFeatureUI}
					style={styles.sideBar}
				/>

				<div>
					{featurePath && (
						<AsyncComponent path={featurePath} style={styles.main} />
					)}
				</div>
			</div>
		);
	}
}
