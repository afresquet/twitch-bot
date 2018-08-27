import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const TopBar = props => (
	<AppBar position="static" {...props}>
		<Toolbar>
			<Typography variant="title" color="inherit">
				Twitch Bot
			</Typography>
		</Toolbar>
	</AppBar>
);

export default TopBar;
