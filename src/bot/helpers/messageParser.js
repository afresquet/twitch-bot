export default message => {
	const [command] = message.split(" ", 1);
	const rest = message.slice(command.length + 1);

	const [option] = rest.split(" ", 1);
	const restAfterOption = message.slice(`${command} ${option} `.length);

	return { command, rest, option, restAfterOption };
};
