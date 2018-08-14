import React from "react";
import PropTypes from "prop-types";
import { List, Divider } from "@material-ui/core";

import ListButton from "../buttons/ListButton";

const SideBar = ({ features, showFeatureUI, ...props }) => (
	<List component="nav" {...props}>
		<ListButton text="Home" icon="Home" />
		<ListButton text="Settings" icon="Build" />

		<Divider />

		{features.map(({ name, icon, react, prefix }) => (
			<ListButton
				text={name}
				icon={icon}
				onClick={showFeatureUI(react, prefix)}
				key={name}
			/>
		))}
	</List>
);

SideBar.propTypes = {
	features: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			react: PropTypes.string.isRequired
		}).isRequired
	).isRequired,
	showFeatureUI: PropTypes.func.isRequired
};

export default SideBar;
