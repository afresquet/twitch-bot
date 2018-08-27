import React from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import * as Icons from "@material-ui/icons";

const ListButton = ({ text, icon, ...props }) => {
	const MaterialIcon = Icons[icon];

	return (
		<ListItem button {...props}>
			{MaterialIcon && (
				<ListItemIcon>
					<MaterialIcon />
				</ListItemIcon>
			)}
			<ListItemText primary={text} inset />
		</ListItem>
	);
};

ListButton.propTypes = {
	text: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired
};

export default ListButton;
