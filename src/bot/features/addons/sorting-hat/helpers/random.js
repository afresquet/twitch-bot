import seedrandom from "seedrandom";

/**
 * @description Gives you a random int between a given range based on a given seed.
 * @param {string} seed Seed to base the number from.
 * @param {number} [range] Defines the range from 0 to (not including) X, defaults to 10.
 */

export const seededInt = (seed, range = 10) =>
	Math.floor(seedrandom(seed)() * Math.floor(range));

/**
 * @description Gives you a random int between a given range.
 * @param {number} [range] Defines the range from 0 to (not including) X, defaults to 10.
 */
export const randomInt = (range = 10) =>
	Math.floor(Math.random() * Math.floor(range));
