export default message => {
	const command = message.split(" ", 1)[0];
	const rest = message.slice(command.length + 1);

	return { command, rest };
};
