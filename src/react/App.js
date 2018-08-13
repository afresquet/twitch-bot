import React, { Component } from "react";
import { ipcRenderer } from "./helpers/react-electron";

import TopBar from "./components/navigation/TopBar";
import SideBar from "./components/navigation/SideBar";
import AsyncComponent from "./components/helpers/AsyncComponent";

const topBarHeight = 65;
const sideBarWidth = 230;

const styles = {
	cointainer: {
		display: "grid",
		gridTemplateColumns: `${sideBarWidth}px auto`
	},
	topBar: {
		gridColumn: "1 / -1",
		height: topBarHeight,
		WebkitAppRegion: "drag",
		WebkitUserSelect: "none"
	},
	sideBar: { height: `calc(100vh - ${topBarHeight}px)`, overflowY: "scroll" },
	main: { height: `calc(100vh - ${topBarHeight}px)`, overflowY: "scroll" }
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
				<TopBar id="topbar" style={styles.topBar} />

				<SideBar
					features={features}
					showFeatureUI={this.showFeatureUI}
					style={styles.sideBar}
				/>

				{featurePath && (
					<AsyncComponent path={featurePath} style={styles.main} />
				)}
			</div>
		);
	}
}
