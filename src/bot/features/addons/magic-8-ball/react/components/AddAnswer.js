import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField, Button } from "@material-ui/core";

class AddAnswer extends Component {
	static propTypes = {
		addAnswer: PropTypes.func.isRequired
	};

	state = {
		newAnswer: ""
	};

	onChange = e => this.setState({ newAnswer: e.target.value });

	addAnswer = () => {
		if (!this.state.newAnswer) return;

		this.props.addAnswer(this.state.newAnswer);

		this.setState({ newAnswer: "" });
	};

	render = () => {
		const { addAnswer, ...props } = this.props;
		const { newAnswer } = this.state;

		return (
			<div {...props}>
				<TextField
					value={newAnswer}
					placeholder="New answer"
					onChange={this.onChange}
				/>

				<Button onClick={this.addAnswer}>Add answer</Button>
			</div>
		);
	};
}

export default AddAnswer;
