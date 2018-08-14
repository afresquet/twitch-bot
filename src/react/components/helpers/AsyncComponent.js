import React from "react";
import PropTypes from "prop-types";
import RendererProcess from "../../classes/RendererProcess";

const AsyncComponent = ({ path, prefix, ...props }) => {
	const LoadedComponent = require(path).default;

	const ipcRenderer = new RendererProcess(prefix);

	return LoadedComponent ? (
		<LoadedComponent {...props} ipcRenderer={ipcRenderer} />
	) : null;
};

AsyncComponent.propTypes = {
	path: PropTypes.string.isRequired,
	prefix: PropTypes.string.isRequired
};

export default AsyncComponent;
