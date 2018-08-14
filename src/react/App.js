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
		features: {},
		currentFeature: {
			path: "",
			prefix: ""
		}
	};

	componentDidMount() {
		ipcRenderer.send("requestFeatures");
		ipcRenderer.once("sendFeatures", (e, features) =>
			this.setState({ features })
		);
	}

	showFeatureUI = (path, prefix) => () =>
		this.setState({ currentFeature: { path, prefix } });

	render() {
		const {
			features,
			currentFeature: { path, prefix }
		} = this.state;

		return (
			<div style={styles.cointainer}>
				<TopBar id="topbar" style={styles.topBar} />

				<SideBar
					features={features}
					showFeatureUI={this.showFeatureUI}
					style={styles.sideBar}
				/>

				{path && (
					<AsyncComponent path={path} prefix={prefix} style={styles.main} />
				)}
			</div>
		);
	}
}
