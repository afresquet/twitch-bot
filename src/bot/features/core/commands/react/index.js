import React, { Component } from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

import CommandsTable from "./components/CommandsTable";
import AddCommand from "./components/AddCommand";

class Commands extends Component {
	static propTypes = {
		ipcRenderer: PropTypes.shape({
			send: PropTypes.func.isRequired,
			on: PropTypes.func.isRequired,
			removeAllListeners: PropTypes.func.isRequired
		}).isRequired
	};

	state = {
		commands: [],
		newCommand: ""
	};

	componentDidMount = () => {
		this.props.ipcRenderer.send("get-commands");
		this.props.ipcRenderer.on("commands", (e, commands) =>
			this.setState({ commands })
		);
	};

	componentWillUnmount = () => {
		this.props.ipcRenderer.removeAllListeners("commands");
	};

	styles = {
		container: { display: "grid", gridTemplateRows: "65px auto 65px" },
		commands: { overflowY: "scroll" },
		addCommand: {
			padding: "15px",
			display: "grid",
			gridTemplateColumns: "auto 120px"
		}
	};

	addCommand = (command, message) =>
		this.props.ipcRenderer.send("new-command", { command, message });

	editCommand = commandToEdit => newMessage =>
		this.props.ipcRenderer.send("edit-command", { commandToEdit, newMessage });

	deleteCommand = commandToDelete => () =>
		this.props.ipcRenderer.send("delete-command", commandToDelete);

	render = () => {
		const { ipcRenderer, ...props } = this.props;
		const { commands } = this.state;

		return (
			<div {...props} style={{ ...props.style, ...this.styles.container }}>
				<AppBar position="sticky" color="secondary">
					<Toolbar>
						<Typography variant="title" color="inherit">
							Commands Feature
						</Typography>
					</Toolbar>
				</AppBar>

				<CommandsTable
					commands={commands}
					editCommand={this.editCommand}
					deleteCommand={this.deleteCommand}
					style={this.styles.commands}
				/>

				<AddCommand
					addCommand={this.addCommand}
					style={this.styles.addCommand}
				/>
			</div>
		);
	};
}

export default Commands;
