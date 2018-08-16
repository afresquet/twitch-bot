import React from "react";
import PropTypes from "prop-types";
import { Table, TableBody } from "@material-ui/core";

import Answer from "./Answer";

const AnswersTable = ({ answers, editAnswer, deleteAnswer, ...props }) => (
	<div {...props}>
		<Table>
			<TableBody>
				{answers.length > 0 &&
					answers.map((answer, i) => (
						<Answer
							key={answer}
							answer={answer}
							editAnswer={editAnswer(i + 1)}
							deleteAnswer={deleteAnswer(i + 1)}
						/>
					))}
			</TableBody>
		</Table>
	</div>
);

AnswersTable.propTypes = {
	answers: PropTypes.arrayOf(PropTypes.string).isRequired,
	editAnswer: PropTypes.func.isRequired,
	deleteAnswer: PropTypes.func.isRequired
};

export default AnswersTable;
