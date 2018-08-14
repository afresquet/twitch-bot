import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from "../../helpers/react-electron";

const AsyncComponent = ({ path, ...props }) => {
	const LoadedComponent = require(path).default;

	return LoadedComponent ? (
		<LoadedComponent {...props} ipcRenderer={ipcRenderer} />
	) : null;
};

AsyncComponent.propTypes = {
	path: PropTypes.string.isRequired
};

export default AsyncComponent;
