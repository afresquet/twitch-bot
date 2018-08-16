import React, { Component } from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, Snackbar } from "@material-ui/core";

import PollStats from "./components/PollStats";
import Settings from "./components/Settings";

class Poll extends Component {
	static propTypes = {
		ipcRenderer: PropTypes.shape({
			on: PropTypes.func.isRequired,
			once: PropTypes.func.isRequired,
			send: PropTypes.func.isRequired,
			removeAllListeners: PropTypes.func.isRequired
		}).isRequired
	};

	state = {
		poll: {
			active: false,
			question: "",
			options: {}
		},
		settings: {},
		showMessage: false
	};

	componentDidMount = () => {
		this.props.ipcRenderer.send("load-data");
		this.props.ipcRenderer.once("data", (e, { poll, settings }) =>
			this.setState({ poll, settings })
		);

		this.props.ipcRenderer.on("poll-active", (e, { question, options }) => {
			this.setState({
				poll: {
					active: true,
					question,
					options
				}
			});
		});
		this.props.ipcRenderer.on("poll-inactive", () => {
			this.setState({
				poll: {
					...this.state.poll,
					active: false
				}
			});
		});
		this.props.ipcRenderer.on("new-vote", (e, vote) => {
			this.setState({
				poll: {
					...this.state.poll,
					options: {
						...this.state.poll.options,
						[vote]: this.state.poll.options[vote] + 1
					}
				}
			});
		});
	};

	componentWillUnmount = () => {
		this.props.ipcRenderer.removeAllListeners("poll-active");
		this.props.ipcRenderer.removeAllListeners("poll-inactive");
		this.props.ipcRenderer.removeAllListeners("new-vote");
	};

	onClose = () => this.setState({ showMessage: false });

	onSettingsChange = ({ target: { id, value } }) =>
		this.setState({
			settings: {
				...this.state.settings,
				[id]: value
			},
			showMessage: false
		});

	updateSettings = () => {
		this.props.ipcRenderer.send("update-settings", this.state.settings);
		this.props.ipcRenderer.once("settings-updated", () =>
			this.setState({ showMessage: true })
		);
	};

	styles = {
		container: {
			display: "grid",
			gridTemplateRows: "65px auto 65px"
		},
		pollStats: {
			padding: 10,
			overflowY: "scroll"
		},
		settings: {
			display: "grid",
			gridTemplateColumns: "auto auto 180px",
			gridGap: 5
		}
	};

	render = () => {
		const { ipcRenderer, ...props } = this.props;
		const { poll, settings, showMessage } = this.state;

		return (
			<div {...props} style={{ ...props.style, ...this.styles.container }}>
				<AppBar position="sticky" color="secondary">
					<Toolbar>
						<Typography variant="title" color="inherit">
							Poll Feature
						</Typography>
					</Toolbar>
				</AppBar>

				<PollStats poll={poll} style={this.styles.pollStats} />

				<Settings
					settings={settings}
					onChange={this.onSettingsChange}
					submit={this.updateSettings}
					style={this.styles.settings}
				/>

				<Snackbar
					message="Success"
					open={showMessage}
					onClose={this.onClose}
					autoHideDuration={5000}
				/>
			</div>
		);
	};
}

export default Poll;
