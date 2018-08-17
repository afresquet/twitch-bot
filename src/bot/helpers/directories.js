import { readdir, lstatSync } from "fs";
import { join } from "path";
import { promisify } from "util";

/**
 * @param {string} source Path of the source folder.
 * @returns {string[]} Folders inside the source folder.
 */
export async function getDirectories(source) {
	const files = await promisify(readdir)(source);

	const directories = files
		.map(path => join(source, path))
		.filter(directory => lstatSync(directory).isDirectory());

	if (!directories.length)
		throw new Error("The source path has no directories.");

	return directories;
}

/**
 * @description Checks if a given path is a directory.
 * @param {string} path Path to check.
 */
export function isDirectory(path) {
	return lstatSync(path).isDirectory();
}
