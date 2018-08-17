import React from "react";
import PropTypes from "prop-types";
import { List, Divider } from "@material-ui/core";
import Dropzone from "react-dropzone";

import ListButton from "../buttons/ListButton";

const SideBar = ({ features, showFeatureUI, onDrop, ...props }) => (
	<Dropzone disableClick multiple={false} {...props} onDrop={onDrop}>
		<List component="nav" {...props}>
			<ListButton text="Home" icon="Home" />
			<ListButton text="Settings" icon="Build" />

			<Divider />

			{features.core &&
				features.core.map(({ name, icon, react, prefix }) => (
					<ListButton
						text={name}
						icon={icon}
						onClick={showFeatureUI(react, prefix)}
						key={name}
					/>
				))}

			<Divider />

			{features.addons &&
				features.addons.map(({ name, icon, react, prefix }) => (
					<ListButton
						text={name}
						icon={icon}
						onClick={showFeatureUI(react, prefix)}
						key={name}
					/>
				))}
		</List>
	</Dropzone>
);

SideBar.propTypes = {
	features: PropTypes.shape({
		core: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				icon: PropTypes.string.isRequired,
				react: PropTypes.string.isRequired,
				prefix: PropTypes.number.isRequired
			}).isRequired
		),
		addons: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				icon: PropTypes.string.isRequired,
				react: PropTypes.string.isRequired,
				prefix: PropTypes.number.isRequired
			}).isRequired
		)
	}),
	showFeatureUI: PropTypes.func.isRequired,
	onDrop: PropTypes.func.isRequired
};

SideBar.defaultProps = {
	features: {
		core: [],
		addons: []
	}
};

export default SideBar;
