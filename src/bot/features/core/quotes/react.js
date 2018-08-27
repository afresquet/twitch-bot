import React from "react";
import PropTypes from "prop-types";

const Quotes = ({ ipcRenderer, ...props }) => (
	<div {...props}>Quote Feature</div>
);

Quotes.propTypes = {
	ipcRenderer: PropTypes.shape({}).isRequired
};

export default Quotes;
