import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography } from "@material-ui/core";

const PollStats = ({ poll, ...props }) => {
	const totalVotes =
		poll.question &&
		Object.values(poll.options).reduce((acc, votes) => acc + votes);

	return (
		<div {...props}>
			<Card>
				<CardContent>
					{!poll.question ? (
						<Typography gutterBottom variant="display1" align="center">
							No polls have been done yet
						</Typography>
					) : (
						<div>
							<Typography gutterBottom variant="display1" align="center">
								{poll.active
									? `"${poll.question}"`
									: `Last poll: "${poll.question}"`}
							</Typography>

							{Object.entries(poll.options)
								.sort(([, a], [, b]) => a < b)
								.map(([option, votes]) => (
									<Typography gutterBottom key={option}>
										<span style={{ fontWeight: 500 }}>{option}:</span> {votes}
									</Typography>
								))}

							<Typography variant="title" align="right">
								Total votes: {totalVotes}
							</Typography>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

PollStats.propTypes = {
	poll: PropTypes.shape({}).isRequired
};

export default PollStats;
