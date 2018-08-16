import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField, Button, TableRow, TableCell } from "@material-ui/core";

class Answer extends Component {
	static propTypes = {
		answer: PropTypes.string.isRequired,
		editAnswer: PropTypes.func.isRequired,
		deleteAnswer: PropTypes.func.isRequired
	};

	state = {
		editing: false,
		newAnswer: null
	};

	onChange = e => this.setState({ newAnswer: e.target.value });

	toggleEditing = () =>
		this.setState({ editing: !this.state.editing, newAnswer: null });

	confirmAnswer = () => {
		if (!this.state.newAnswer) return;
		this.props.editAnswer(this.state.newAnswer);
		this.toggleEditing();
	};

	render = () => {
		const { answer, deleteAnswer } = this.props;
		const { editing, newAnswer } = this.state;

		return (
			<TableRow>
				<TableCell>
					{!editing ? (
						answer
					) : (
						<TextField
							id="newAnswer"
							placeholder="Edit answer"
							value={newAnswer === null ? answer : newAnswer}
							onChange={this.onChange}
							style={{ width: "100%" }}
						/>
					)}
				</TableCell>

				<TableCell numeric>
					{editing && <Button onClick={this.confirmAnswer}>Confirm</Button>}

					<Button onClick={this.toggleEditing}>
						{!editing ? "Edit" : "Back"}
					</Button>

					<Button onClick={deleteAnswer}>Delete</Button>
				</TableCell>
			</TableRow>
		);
	};
}

export default Answer;
