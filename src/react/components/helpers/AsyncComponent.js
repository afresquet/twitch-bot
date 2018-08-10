import React from "react";
import PropTypes from "prop-types";

const AsyncComponent = ({ path, ...props }) => {
	const LoadedComponent = require(path);

	return LoadedComponent ? <LoadedComponent {...props} /> : null;
};

AsyncComponent.propTypes = {
	path: PropTypes.string.isRequired
};

export default AsyncComponent;
