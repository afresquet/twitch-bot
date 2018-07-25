import { readdir, lstatSync } from "fs";
import { join } from "path";
import { promisify } from "util";

/**
 * @param {string} source Path of the source folder.
 * @returns {string[]} Folders inside the source folder.
 */
export default async source => {
	const files = await promisify(readdir)(source);

	const paths = files.map(name => join(source, name));

	const directories = paths.filter(path => lstatSync(path).isDirectory());

	if (!directories.length)
		throw new Error("The source path has no directories.");

	return directories;
};
