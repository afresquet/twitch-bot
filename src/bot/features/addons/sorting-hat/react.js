import React from "react";
import PropTypes from "prop-types";

const SortingHat = ({ ipcRenderer, ...props }) => (
	<div {...props}>Sorting Hat Feature</div>
);

SortingHat.propTypes = {
	ipcRenderer: PropTypes.shape({}).isRequired
};

export default SortingHat;
