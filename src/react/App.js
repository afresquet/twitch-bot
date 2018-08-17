import React, { Component } from "react";
import { ipcRenderer } from "./helpers/react-electron";

import TopBar from "./components/navigation/TopBar";
import SideBar from "./components/navigation/SideBar";
import AsyncComponent from "./components/helpers/AsyncComponent";
import NewFeatureDialog from "./components/dialogs/NewFeatureDialog";

export default class App extends Component {
	state = {
		features: {},
		currentFeature: {
			path: "",
			prefix: ""
		},
		confirmation: {
			open: false,
			name: ""
		}
	};

	componentDidMount() {
		ipcRenderer.send("requestFeatures");
		ipcRenderer.on("features", (_, features) => this.setState({ features }));
	}

	componentWillUnmount = () => ipcRenderer.removeAllListeners("features");

	onDrop = ([file], rejectedFiles) => {
		if (rejectedFiles.length > 0) return;

		ipcRenderer.send("new-feature", file.path);
		ipcRenderer.once("new-feature-response", (_, name) => {
			this.setState({
				confirmation: {
					open: true,
					name
				}
			});
		});
	};

	showFeatureUI = (path, prefix) => () =>
		this.setState({ currentFeature: { path, prefix } });

	toggleConfirmation = () =>
		this.setState({
			confirmation: {
				...this.state.confirmation,
				open: !this.state.confirmation.open
			}
		});

	sendConfirmation = bool => () => {
		ipcRenderer.send("new-feature-confirmation", bool);
		this.toggleConfirmation();
	};

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
			currentFeature: { path, prefix },
			confirmation
		} = this.state;

		return (
			<div style={this.styles.cointainer}>
				<TopBar id="topbar" style={this.styles.topBar} />

				<SideBar
					features={features}
					showFeatureUI={this.showFeatureUI}
					onDrop={this.onDrop}
					style={this.styles.sideBar}
				/>

				{path && (
					<AsyncComponent
						path={path}
						prefix={prefix}
						style={this.styles.main}
					/>
				)}

				<NewFeatureDialog
					confirmation={confirmation}
					toggleConfirmation={this.toggleConfirmation}
					sendConfirmation={this.sendConfirmation}
				/>
			</div>
		);
	}
}
