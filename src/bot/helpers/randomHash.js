/**
 * @description Generates a random hash with provided length from 1 to 10000.
 * @param {number} length Length of the hash
 */
export default function randomHash(length) {
	if (!Number.isInteger(length) || length < 1 || length > 10000)
		throw new Error(
			"Invalid parameter, please enter a number from 1 to 10000."
		);

	if (length <= 5)
		return Math.random()
			.toString(36)
			.substr(2, length);

	return (
		Math.random()
			.toString(36)
			.substr(2, 5) + randomHash(length - 5)
	);
}
