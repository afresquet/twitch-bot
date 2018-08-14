import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	AppBar,
	Toolbar,
	Typography,
	TextField,
	Button,
	Snackbar
} from "@material-ui/core";

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
		pollActive: false,
		poll: {},
		voters: 0,
		settings: {},
		showMessage: false
	};

	componentDidMount = () => {
		this.props.ipcRenderer.send("load-data");
		this.props.ipcRenderer.once(
			"data",
			(e, { state, settings: { _id, ...settings } }) =>
				this.setState({ ...state, settings })
		);

		this.props.ipcRenderer.on("poll-active", (e, poll) => {
			this.setState({
				pollActive: true,
				poll
			});
		});
		this.props.ipcRenderer.on("poll-inactive", () => {
			this.setState({
				pollActive: false,
				poll: {},
				voters: 0
			});
		});
	};

	componentWillUnmount = () => {
		this.props.ipcRenderer.removeAllListeners("poll-active");
		this.props.ipcRenderer.removeAllListeners("poll-inactive");
	};

	onChange = ({ target: { id, value } }) =>
		this.setState({
			settings: {
				...this.state.settings,
				[id]: value
			},
			showMessage: false
		});

	onClose = () => this.setState({ showMessage: false });

	updateSettings = () => {
		this.props.ipcRenderer.send("update-settings", this.state.settings);
		this.props.ipcRenderer.once("settings-updated", () =>
			this.setState({ showMessage: true })
		);
	};

	render = () => {
		const { ipcRenderer, ...props } = this.props;
		const { pollActive, settings, showMessage } = this.state;

		return (
			<div {...props}>
				<AppBar position="sticky" color="secondary">
					<Toolbar>
						<Typography variant="title" color="inherit">
							Poll Feature
						</Typography>
					</Toolbar>
				</AppBar>

				{pollActive ? <h1>Poll is active</h1> : <h1>Poll is not active</h1>}

				{Object.entries(settings).map(([setting, value]) => (
					<TextField
						id={setting}
						key={setting}
						label={setting}
						value={value}
						onChange={this.onChange}
						type="number"
						margin="normal"
						style={{
							marginLeft: 5
						}}
					/>
				))}

				<Button disableRipple onClick={this.updateSettings}>
					Update Settings
				</Button>

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
