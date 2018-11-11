import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField, Button } from "@material-ui/core";

class AddCommand extends Component {
	static propTypes = {
		addCommand: PropTypes.func.isRequired
	};

	state = {
		newCommand: "",
		newMessage: ""
	};

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	addCommand = () => {
		if (!this.state.newCommand) return;

		this.props.addCommand(this.state.newCommand);

		this.setState({ newCommand: "", newMessage: "" });
	};

	render = () => {
		const { addCommand, ...props } = this.props;
		const { newCommand, newMessage } = this.state;

		return (
			<div {...props}>
				<TextField
					id="newCommand"
					value={newCommand}
					placeholder="New command"
					onChange={this.onChange}
				/>
				<TextField
					id="newMessage"
					value={newMessage}
					placeholder="New message"
					onChange={this.onChange}
				/>

				<Button onClick={this.addCommand}>Add command</Button>
			</div>
		);
	};
}

export default AddCommand;
