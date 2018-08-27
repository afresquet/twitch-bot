import React from "react";
import PropTypes from "prop-types";

const Troll = ({ ipcRenderer, ...props }) => (
	<div
		{...props}
		style={{
			...props.style,
			backgroundImage:
				'url("http://www.irishtimes.com/blogs/screenwriter/files/2013/07/TDW151.troll_hunter_fur-300x160.jpg")',
			backgroundSize: "cover",
			backgroundRepeat: "no-repeat",
			backgroundPosition: "50% 50%"
		}}
	/>
);

Troll.propTypes = {
	ipcRenderer: PropTypes.shape({}).isRequired,
	style: PropTypes.shape({}).isRequired
};

export default Troll;
