import React from "react";
import PropTypes from "prop-types";
import { Table, TableBody } from "@material-ui/core";

import Command from "./Command";

const CommandsTable = ({ commands, editCommand, deleteCommand, ...props }) => (
	<div {...props}>
		<Table>
			<TableBody>
				{commands.length > 0 &&
					commands.map(({ _id: command, message }) => (
						<Command
							key={message}
							command={command}
							message={message}
							editCommand={editCommand(command)}
							deleteCommand={deleteCommand(command)}
						/>
					))}
			</TableBody>
		</Table>
	</div>
);

CommandsTable.propTypes = {
	commands: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			message: PropTypes.string.isRequired
		}).isRequired
	).isRequired,
	editCommand: PropTypes.func.isRequired,
	deleteCommand: PropTypes.func.isRequired
};

export default CommandsTable;
