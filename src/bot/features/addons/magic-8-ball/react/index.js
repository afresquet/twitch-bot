import React, { Component } from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

import AnswersTable from "./components/AnswersTable";
import AddAnswer from "./components/AddAnswer";

class Magic8Ball extends Component {
	static propTypes = {
		ipcRenderer: PropTypes.shape({
			send: PropTypes.func.isRequired,
			on: PropTypes.func.isRequired,
			removeAllListeners: PropTypes.func.isRequired
		}).isRequired
	};

	state = {
		answers: [],
		newAnswer: ""
	};

	componentDidMount = () => {
		this.props.ipcRenderer.send("get-answers");
		this.props.ipcRenderer.on("answers", (e, answers) =>
			this.setState({ answers })
		);
	};

	componentWillUnmount = () => {
		this.props.ipcRenderer.removeAllListeners("answers");
	};

	styles = {
		container: { display: "grid", gridTemplateRows: "65px auto 65px" },
		answers: { overflowY: "scroll" },
		addAnswer: {
			padding: "15px",
			display: "grid",
			gridTemplateColumns: "auto 120px"
		}
	};

	addAnswer = answer => this.props.ipcRenderer.send("new-answer", answer);

	editAnswer = oldAnswer => newAnswer =>
		this.props.ipcRenderer.send("edit-answer", { oldAnswer, newAnswer });

	deleteAnswer = answer => () =>
		this.props.ipcRenderer.send("delete-answer", answer);

	render = () => {
		const { ipcRenderer, ...props } = this.props;
		const { answers } = this.state;

		return (
			<div {...props} style={{ ...props.style, ...this.styles.container }}>
				<AppBar position="sticky" color="secondary">
					<Toolbar>
						<Typography variant="title" color="inherit">
							8-Ball Feature
						</Typography>
					</Toolbar>
				</AppBar>

				<AnswersTable
					answers={answers}
					editAnswer={this.editAnswer}
					deleteAnswer={this.deleteAnswer}
					style={this.styles.answers}
				/>

				<AddAnswer addAnswer={this.addAnswer} style={this.styles.addAnswer} />
			</div>
		);
	};
}

export default Magic8Ball;
