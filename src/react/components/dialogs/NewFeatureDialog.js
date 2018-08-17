import React from "react";
import PropTypes from "prop-types";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button
} from "@material-ui/core";

const NewFeatureDialog = ({
	confirmation: { open, name },
	toggleConfirmation,
	sendConfirmation
}) => (
	<Dialog open={open} onClose={toggleConfirmation}>
		<DialogTitle>Add new feature {`"${name}"`}?</DialogTitle>
		<DialogContent>
			<DialogContentText id="alert-dialog-description">
				Be careful, make sure of what you are adding.
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button onClick={sendConfirmation(false)} color="primary">
				Cancel
			</Button>
			<Button onClick={sendConfirmation(true)} color="primary" autoFocus>
				Confirm
			</Button>
		</DialogActions>
	</Dialog>
);

NewFeatureDialog.propTypes = {
	confirmation: PropTypes.shape({
		open: PropTypes.bool.isRequired,
		name: PropTypes.string.isRequired
	}).isRequired,
	toggleConfirmation: PropTypes.func.isRequired,
	sendConfirmation: PropTypes.func.isRequired
};

export default NewFeatureDialog;
