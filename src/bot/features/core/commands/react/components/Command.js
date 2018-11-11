import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField, Button, TableRow, TableCell } from "@material-ui/core";

class Command extends Component {
	static propTypes = {
		command: PropTypes.string.isRequired,
		message: PropTypes.string.isRequired,
		editCommand: PropTypes.func.isRequired,
		deleteCommand: PropTypes.func.isRequired
	};

	state = {
		editing: false,
		newCommand: null,
		newMessage: null
	};

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	toggleEditing = () =>
		this.setState({
			editing: !this.state.editing,
			newCommand: null,
			newMessage: null
		});

	confirmCommand = () => {
		if (!this.state.newCommand) return;
		this.props.editCommand(this.state.newCommand);
		this.toggleEditing();
	};

	render = () => {
		const { command, message, deleteCommand } = this.props;
		const { editing, newCommand, newMessage } = this.state;

		return (
			<TableRow>
				<TableCell>
					{!editing ? (
						command
					) : (
						<TextField
							id="newCommand"
							placeholder="Edit command"
							value={newCommand === null ? command : newCommand}
							onChange={this.onChange}
						/>
					)}
				</TableCell>

				<TableCell>
					{!editing ? (
						message
					) : (
						<TextField
							id="newMessage"
							placeholder="Edit message"
							value={newMessage === null ? message : newMessage}
							onChange={this.onChange}
							fullWidth
						/>
					)}
				</TableCell>

				<TableCell numeric>
					{editing && <Button onClick={this.confirmCommand}>Confirm</Button>}

					<Button onClick={this.toggleEditing}>
						{!editing ? "Edit" : "Back"}
					</Button>

					<Button onClick={deleteCommand}>Delete</Button>
				</TableCell>
			</TableRow>
		);
	};
}

export default Command;
