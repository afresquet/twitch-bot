import React from "react";
import PropTypes from "prop-types";
import { TextField, Button } from "@material-ui/core";

const Settings = ({ settings, onChange, submit, ...props }) => (
	<div {...props}>
		<TextField
			id="maxSeconds"
			label="Max seconds"
			value={settings.maxSeconds || ""}
			onChange={onChange}
			type="number"
		/>

		<TextField
			id="minSeconds"
			label="Min seconds"
			value={settings.minSeconds || ""}
			onChange={onChange}
			type="number"
		/>

		<Button onClick={submit}>Update Settings</Button>
	</div>
);

Settings.propTypes = {
	settings: PropTypes.shape({}).isRequired,
	onChange: PropTypes.func.isRequired,
	submit: PropTypes.func.isRequired
};

export default Settings;
