import React, { Component } from "react";
import { ipcRenderer } from "./helpers/react-electron";

import TopBar from "./components/navigation/TopBar";
import SideBar from "./components/navigation/SideBar";
import AsyncComponent from "./components/helpers/AsyncComponent";

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
		ipcRenderer.once("features", (e, features) => this.setState({ features }));
	}

	showFeatureUI = (path, prefix) => () =>
		this.setState({ currentFeature: { path, prefix } });

	topBarHeight = 65;
	sideBarWidth = 230;
	styles = {
		cointainer: {
			display: "grid",
			gridTemplateColumns: `${this.sideBarWidth}px auto`
		},
		topBar: {
			gridColumn: "1 / -1",
			height: this.topBarHeight,
			WebkitAppRegion: "drag",
			WebkitUserSelect: "none"
		},
		sideBar: {
			height: `calc(100vh - ${this.topBarHeight}px)`,
			overflowY: "scroll"
		},
		main: {
			height: `calc(100vh - ${this.topBarHeight}px)`,
			width: `calc(100vw - ${this.sideBarWidth}px)`
		}
	};

	render() {
		const {
			features,
			currentFeature: { path, prefix }
		} = this.state;

		return (
			<div style={this.styles.cointainer}>
				<TopBar id="topbar" style={this.styles.topBar} />

				<SideBar
					features={features}
					showFeatureUI={this.showFeatureUI}
					style={this.styles.sideBar}
				/>

				{path && (
					<AsyncComponent
						path={path}
						prefix={prefix}
						style={this.styles.main}
					/>
				)}
			</div>
		);
	}
}
